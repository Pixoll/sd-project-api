import { Endpoint } from "./base";
import { User } from "../schemas/user";
import { Util } from "../util";

export class UsersMeEndpoint extends Endpoint implements Endpoint.GetMethod {
    public constructor() {
        super("/users/me");
    }

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
    public async get(
        request: Endpoint.Request,
        response: Endpoint.Response<Omit<User.JSON, "password" | "salt">>
    ): Promise<void> {
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

        Endpoint.sendOk(response, Util.omit(User.toJSON(user), ["password", "salt"]));
    }
}
