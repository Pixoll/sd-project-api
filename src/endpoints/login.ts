import { User, validateStructure } from "../db";
import { HTTPCode, Methods, sendError, sendOk } from "./base";
import { hashPassword } from "./users";

export const methods = {
    /**
     * @name Login User
     * @description Verify user login credentials.
     * @body email -- string -- The user's email.
     * @body password -- string -- The user's password.
     * @code 200 Successfully logged in.
     * @code 400 Malformed request.
     * @code 401 Wrong password.
     * @code 404 User with that `email` does not exist.
     */
    async post(request, response): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }

        const { email, password } = request.body as Partial<Record<string, string>>;
        if (!email || !password) {
            sendError(response, HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }

        const validationResult = validateStructure({ email, password }, User.Model, true);
        if (validationResult !== true) {
            sendError(response, HTTPCode.BadRequest, validationResult);
            return;
        }

        const matchingUser = await User.Model.findOne({ email });
        if (!matchingUser) {
            sendError(response, HTTPCode.NotFound, "User does not exist.");
            return;
        }

        const { salt, password: savedPassword } = matchingUser;
        if (hashPassword(password, salt) !== savedPassword) {
            sendError(response, HTTPCode.Unauthorized, "Wrong password.");
            return;
        }

        // TODO access tokens???
        sendOk(response);
    },
} satisfies Methods;
