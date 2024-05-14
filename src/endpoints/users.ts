import { createHash, randomBytes } from "crypto";
import { HTTPCode, EndpointHandler, sendOk, sendCreated, sendNoContent, sendError, getAuthorizedUser } from "./base";
import { User, validateStructure } from "../db";
import { hasOneOfKeys, omit, replaceKeys } from "../util";

export const methods = {
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
    async get(request, response): Promise<void> {
        if (getAuthorizedUser(request)?.type !== "admin") {
            sendError(response, HTTPCode.Unauthorized, "Not an admin.");
            return;
        }

        const { rut, email, phone } = request.query;
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

        const userJson = request.body;
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
     * @description **Only usable while logged in as a user.**
     * @description Delete the {schema:User}'s account.
     * @header Authorization | string | Session token of the logged in user. See {endpoint:users/login}.
     * @query rut | string | RUT of the user.
     * @code 204 Successfully deleted the user.
     * @code 401 Not logged in.
     * @code 404 User does not exist.
     */
    async delete(request, response): Promise<void> {
        const authorizedUser = getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            sendError(response, HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        try {
            const user = await User.Model.findById(authorizedUser.rut);
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
} satisfies EndpointHandler<{
    get: {
        queryKeys: "rut" | "email" | "phone";
        responseData: Omit<User.JSON, "password" | "salt">;
    };
    post: {
        body: User.JSON;
    };
    delete: {
        queryKeys: "rut";
    };
}>;

export function hashPassword(password: string, salt: string): string {
    return createHash("sha256").update(password + salt).digest("hex");
}
