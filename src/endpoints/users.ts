import { createHash, randomBytes } from "crypto";
import { HTTPCode, Methods, sendOk, sendCreated, sendNoContent, sendError } from "./base";
import { User, validateStructure } from "../db";
import { hasOneOfKeys, omit, replaceKeys } from "../util";

export const methods = {
    /**
     * @name Get User
     * @description Returns a {schema:User} for the given `rut`, `email` or `phone` number.
     * @query rut -- number -- RUT of the user. `email` and `phone` cannot be present if this parameter is.
     * @query email -- string -- Email of the user. `rut` and `phone` cannot be present if this parameter is.
     * @query phone -- number -- Phone number of the user. `rut` and `email` cannot be present if this parameter is.
     * @response A {schema:User} object without the `password` and `salt` fields.
     * @code 200 Successfully retrieved the user.
     * @code 400 Provided none or more than one kind of parameter, or the parameter is malformed.
     * @code 404 No user exists with the provided query.
     */
    async get(request, response): Promise<void> {
        const { rut, email, phone } = request.query as Record<string, string | undefined>;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            sendError(response, HTTPCode.BadRequest, "Expected only one of either rut, email or phone in query.");
            return;
        }

        const search = {
            ...rut && { rut },
            ...email && { email },
            ...phone && { phone: parseInt(phone) },
        };
        const validationResult = await validateStructure(search, User.Model, { partial: true });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
            return;
        }

        try {
            const user = await User.Model.findOne(replaceKeys(search, { rut: "_id" } as const));
            if (!user) {
                sendError(response, HTTPCode.NotFound, "User does not exist.");
                return;
            }

            sendOk(response, omit(User.toJSON(user), ["password", "salt"]));
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to get user.");
        }
    },

    /**
     * @name Create User
     * @description Create a new {schema:User}. Only one user per `rut`, `email` or `phone` number may exist at one time.
     * @body A {schema:User} object without the `salt`, `verified`, `created_timestamp` and `updated_timestamp` fields.
     * @code 201 Successfully created new user.
     * @code 400 Malformed user structure.
     * @code 409 A user with that `rut`, `email` or `phone` number already exists.
     */
    async post(request, response): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }

        if (hasOneOfKeys(request.body, ["salt", "verified", "created_timestamp", "updated_timestamp"])) {
            sendError(
                response,
                HTTPCode.BadRequest,
                "Password 'salt', 'verified', 'created_timestamp' and 'updated_timestamp' fields"
                + " may not be specified in the request."
            );
            return;
        }

        const validationResult = await validateStructure(request.body, User.Model, { exclude: ["salt", "verified"] });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const userJson = request.body as User.JSON;
        const { rut, email, phone } = userJson;

        try {
            const existingRut = await User.Model.findOne({ _id: rut });
            if (existingRut) {
                sendError(response, HTTPCode.Conflict, "User with specified RUT already exists.");
                return;
            }

            const existingEmail = await User.Model.findOne({ email });
            if (existingEmail) {
                sendError(response, HTTPCode.Conflict, "User with specified email already exists.");
                return;
            }

            const existingPhone = await User.Model.findOne({ phone });
            if (existingPhone) {
                sendError(response, HTTPCode.Conflict, "User with specified phone number already exists.");
                return;
            }
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to find existing user.");
            return;
        }

        const salt = randomBytes(16).toString("hex");

        try {
            await new User.Model({
                ...replaceKeys(omit(userJson, ["password"]), { rut: "_id" } as const),
                password: hashPassword(userJson.password, salt),
                salt,
            }).save();

            sendCreated(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to create new user.");
        }
    },

    /**
     * @name Delete User
     * @description Delete the {schema:User} matching the provided `rut`.
     * @query rut -- string -- RUT of the user.
     * @code 204 Successfully deleted the user.
     * @code 400 Did not provide `rut`, or malformed `rut`.
     * @code 404 User with that `rut` does not exist.
     */
    async delete(request, response): Promise<void> {
        const { rut } = request.query as Record<string, string | undefined>;
        if (!rut) {
            sendError(response, HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }

        if (!User.isValidRut(rut)) {
            sendError(response, HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }

        try {
            const user = await User.Model.findById(rut);
            if (!user) {
                sendError(response, HTTPCode.NotFound, "User does not exist.");
                return;
            }

            await user.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to delete the user.");
        }
    },
} satisfies Methods;

export function hashPassword(password: string, salt: string): string {
    return createHash("sha256").update(password + salt).digest("hex");
}
