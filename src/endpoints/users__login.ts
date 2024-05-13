import { HTTPCode, EndpointHandler, sendError, sendOk } from "./base";
import { hashPassword } from "./users";
import { User, validateStructure } from "../db";
import { generateToken } from "../tokens";

export const methods = {
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
    async post(request, response): Promise<void> {
        const { email, password } = request.body as Partial<Record<string, string>>;
        if (!email || !password) {
            sendError(response, HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }

        const validationResult = await validateStructure({ email, password }, User.Model, { partial: true });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const matchingUser = await User.Model.findOne({ email });
        if (!matchingUser) {
            sendError(response, HTTPCode.NotFound, "User does not exist.");
            return;
        }

        const { rut, salt, password: savedPassword } = User.toJSON(matchingUser);
        if (hashPassword(password, salt) !== savedPassword) {
            sendError(response, HTTPCode.Unauthorized, "Wrong password.");
            return;
        }

        sendOk(response, {
            "session_token": generateToken("user", rut),
        });
    },
} satisfies EndpointHandler;
