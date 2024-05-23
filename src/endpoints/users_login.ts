import { Endpoint } from "./base";
import { UsersEndpoint } from "./users";
import { StructureValidator } from "../schemas/validator";
import { User } from "../schemas/user";
import { TokenManager } from "../tokens";

export class UsersLoginEndpoint extends Endpoint implements Endpoint.PostMethod {
    public constructor() {
        super("/users/login");
    }

    /**
     * @name Login as User
     * @description Verify user login credentials.
     * @body email | string | The user's email.
     * @body password | string | The user's password.
     * @response session_token | string | Session token for the logged in user.
     * @code 200 Successfully logged in.
     * @code 400 Malformed request.
     * @code 401 Wrong password.
     * @code 404 User with that `email` does not exist.
     */
    public async post(
        request: Endpoint.Request<{ email: string; password: string }>,
        response: Endpoint.Response<{ session_token: string }>
    ): Promise<void> {
        const { email, password } = request.body;
        if (!email || !password) {
            Endpoint.sendError(
                response,
                Endpoint.HTTPCode.BadRequest,
                "Expected both email and password in the request body."
            );
            return;
        }

        const validationResult = await StructureValidator.run({ email, password }, User.Model, { partial: true });
        if (!validationResult.ok) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const matchingUser = await User.Model.findOne({ email });
        if (!matchingUser) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }

        const { rut, salt, password: savedPassword } = User.toJSON(matchingUser);
        if (UsersEndpoint.hashPassword(password, salt) !== savedPassword) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }

        Endpoint.sendOk(response, {
            "session_token": TokenManager.generateToken("user", rut),
        });
    }
}
