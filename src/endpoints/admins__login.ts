import { HTTPCode, Methods, sendError, sendOk } from "./base";
import { hashPassword } from "./users";
import { Admin, validateStructure } from "../db";
import { generateToken } from "../tokens";

export const methods = {
    /**
     * @name Login as Admin
     * @description Verify admin login credentials.
     * @body email -- string -- The admin's email.
     * @body password -- string -- The admin's password.
     * @response session_token -- string -- Session token for the logged in admin.
     * @code 200 Successfully logged in.
     * @code 400 Malformed request.
     * @code 401 Wrong password.
     * @code 404 Admin with that `email` does not exist.
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

        const validationResult = await validateStructure({ email, password }, Admin.Model, { partial: true });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const matchingAdmin = await Admin.Model.findOne({ email });
        if (!matchingAdmin) {
            sendError(response, HTTPCode.NotFound, "Admin does not exist.");
            return;
        }

        const { rut, salt, password: savedPassword } = Admin.toJSON(matchingAdmin);
        if (hashPassword(password, salt) !== savedPassword) {
            sendError(response, HTTPCode.Unauthorized, "Wrong password.");
            return;
        }

        sendOk(response, {
            "session_token": generateToken("admin", rut),
        });
    },
} satisfies Methods;
