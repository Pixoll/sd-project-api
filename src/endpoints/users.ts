import { createHash, randomBytes } from "crypto";
import { Endpoint } from "./base";
import { User } from "../schemas/user";
import { StructureValidator } from "../schemas/validator";
import { Util } from "../util";

export class UsersEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    public constructor() {
        super("/users");
    }

    /**
     * @name Get User
     * @description **Only usable while logged in as an admin.**
     * @description Returns a {schema:User} for the given `rut`, `email` or `phone` number.
     * @header Authorization | string | Session token of the logged in admin. See {endpoint:admins/login}.
     * @query rut | number | RUT of the user. `email` and `phone` cannot be present if this parameter is.
     * @query email | string | Email of the user. `rut` and `phone` cannot be present if this parameter is.
     * @query phone | number | Phone number of the user. `rut` and `email` cannot be present if this parameter is.
     * @response A {schema:User} object without the `password` and `salt` fields.
     * @code 200 Successfully retrieved the user.
     * @code 400 Provided none or more than one kind of parameter, or the parameter is malformed.
     * @code 401 Not an admin.
     * @code 404 No user exists with the provided query.
     */
    public async get(
        request: Endpoint.Request<{}, "rut" | "email" | "phone">,
        response: Endpoint.Response<Omit<User.JSON, "password" | "salt">>
    ): Promise<void> {
        if (Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }

        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            Endpoint.sendError(
                response,
                Endpoint.HTTPCode.BadRequest,
                "Expected only one of either rut, email or phone in query."
            );
            return;
        }

        const search = {
            ...rut && { rut },
            ...email && { email },
            ...phone && { phone: parseInt(phone) },
        };
        const validationResult = await StructureValidator.run(search, User.Model, { partial: true });
        if (!validationResult.ok) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const user = await User.Model.findOne(Util.replaceKeys(search, { rut: "_id" } as const));
        if (!user) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }

        Endpoint.sendOk(response, Util.omit(User.toJSON(user), ["password", "salt"]));
    }

    /**
     * @name Create User
     * @description Create a new {schema:User}. Only one user per `rut`, `email` or `phone` number may exist at one time.
     * @body A {schema:User} object without the `salt`, `verified`, `created_timestamp` and `updated_timestamp` fields.
     * @code 201 Successfully created new user.
     * @code 400 Malformed user structure.
     * @code 409 A user with that `rut`, `email` or `phone` number already exists.
     */
    public async post(request: Endpoint.Request<User.JSON>, response: Endpoint.Response): Promise<void> {
        if (Util.hasOneOfKeys(request.body, ["salt", "verified", "created_timestamp", "updated_timestamp"])) {
            Endpoint.sendError(
                response,
                Endpoint.HTTPCode.BadRequest,
                "Password 'salt', 'verified', 'created_timestamp' and 'updated_timestamp' fields"
                + " may not be specified in the request."
            );
            return;
        }

        const validationResult = await StructureValidator.run(request.body, User.Model, { exclude: ["salt", "verified"] });
        if (!validationResult.ok) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const userJson = request.body;
        const { rut, email, phone } = userJson;

        const existingRut = await User.Model.findOne({ _id: rut });
        if (existingRut) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Conflict, "User with specified RUT already exists.");
            return;
        }

        const existingEmail = await User.Model.findOne({ email });
        if (existingEmail) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Conflict, "User with specified email already exists.");
            return;
        }

        const existingPhone = await User.Model.findOne({ phone });
        if (existingPhone) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Conflict, "User with specified phone number already exists.");
            return;
        }

        const salt = randomBytes(16).toString("hex");

        await new User.Model({
            ...Util.replaceKeys(Util.omit(userJson, ["password"]), { rut: "_id" } as const),
            password: UsersEndpoint.hashPassword(userJson.password, salt),
            salt,
        }).save();

        Endpoint.sendCreated(response);
    }

    /**
     * @name Delete User
     * @description **Only usable while logged in as a user.**
     * @description Delete the {schema:User}'s account.
     * @header Authorization | string | Session token of the logged in user. See {endpoint:users/login}.
     * @query rut | string | RUT of the user.
     * @code 204 Successfully deleted the user.
     * @code 401 Not logged in.
     * @code 404 User does not exist.
     */
    public async delete(request: Endpoint.Request, response: Endpoint.Response): Promise<void> {
        const authorizedUser = Endpoint.getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        const user = await User.Model.findById(authorizedUser.rut);
        if (!user) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }

        await user.deleteOne();
        Endpoint.sendNoContent(response);
    }

    public static hashPassword(password: string, salt: string): string {
        return createHash("sha256").update(password + salt).digest("hex");
    }
}
