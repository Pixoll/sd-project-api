import { User } from "../db";
import { omit } from "../util";
import { EndpointHandler, HTTPCode, getAuthorizedUser, sendError, sendOk } from "./base";

export const methods = {
    /**
     * @name Get Current User
     * @description **Only usable while logged in as a user.**
     * @description Returns the information of the current logged in {schema:User}.
     * @header Authorization | string | Session token of the logged in user. See {endpoint:users/login}.
     * @response A {schema:User} object without the `password` and `salt` fields.
     * @code 200 Successfully retrieved the user.
     * @code 401 Not logged in.
     * @code 404 User does not exist.
     */
    async get(request, response): Promise<void> {
        const authorizedUser = getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            sendError(response, HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        const user = await User.Model.findById(authorizedUser.rut);
        if (!user) {
            sendError(response, HTTPCode.NotFound, "User does not exist.");
            return;
        }

        sendOk(response, omit(User.toJSON(user), ["password", "salt"]));
    },
} satisfies EndpointHandler<{
    get: {
        responseData: Omit<User.JSON, "password" | "salt">;
    };
}>;
