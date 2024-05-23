import { Endpoint } from "./base";
import { Admin } from "../schemas/admin";
import { User } from "../schemas/user";
import { Util } from "../util";

export class AdminsEndpoint extends Endpoint implements Endpoint.GetMethod {
    public constructor() {
        super("/admins");
    }

    /**
     * @name Get Admin
     * @description **Only usable while logged in as an admin.**
     * @description Returns an {schema:Admin} for the given `rut`.
     * @header Authorization | string | Session token of the logged in admin. See {endpoint:admins/login}.
     * @query rut | number | RUT of the admin.
     * @response An {schema:Admin} object without the `password` and `salt` fields.
     * @code 200 Successfully retrieved the admin.
     * @code 400 Did not provide `rut` or it's malformed.
     * @code 401 Not an admin.
     * @code 404 No admin exists with that `rut`.
     */
    public async get(
        request: Endpoint.Request<never, "rut">,
        response: Endpoint.Response<Omit<Admin.JSON, "password" | "salt">>
    ): Promise<void> {
        if (Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }

        const { rut } = request.query;
        if (!rut) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Expected rut in query.");
            return;
        }

        if (!User.isValidRut(rut)) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }

        const admin = await Admin.Model.findById(rut);
        if (!admin) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }

        Endpoint.sendOk(response, Util.omit(Admin.toJSON(admin), ["password", "salt"]));
    }
}
