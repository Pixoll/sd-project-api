import { Endpoint } from "./base";
import { UsersEndpoint } from "./users";
import { Admin } from "../schemas/admin";
import { StructureValidator } from "../schemas/validator";
import { TokenManager } from "../tokens";

export class AdminsLoginEndpoint extends Endpoint implements Endpoint.PostMethod {
    public constructor() {
        super("/admins/login");
    }

    /**
     * @name Login as Admin
     * @description Verify admin login credentials.
     * @body email | string | The admin's email.
     * @body password | string | The admin's password.
     * @response session_token | string | Session token for the logged in admin.
     * @code 200 Successfully logged in.
     * @code 400 Malformed request.
     * @code 401 Wrong password.
     * @code 404 Admin with that `email` does not exist.
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

        const validationResult = await StructureValidator.run({ email, password }, Admin.Model, { partial: true });
        if (!validationResult.ok) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const matchingAdmin = await Admin.Model.findOne({ email });
        if (!matchingAdmin) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }

        const { rut, salt, password: savedPassword } = Admin.toJSON(matchingAdmin);
        if (UsersEndpoint.hashPassword(password, salt) !== savedPassword) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }

        Endpoint.sendOk(response, {
            "session_token": TokenManager.generateToken("admin", rut),
        });
    }
}
