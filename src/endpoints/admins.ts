import { createHash } from "crypto";
import { HTTPCode, EndpointHandler, sendOk, sendError } from "./base";
import { Admin, User } from "../db";
import { omit } from "../util";

export const methods = {
    /**
     * @name Get Admin
     * @description Returns an {schema:Admin} for the given `rut`.
     * @query rut | number | RUT of the admin.
     * @response An {schema:Admin} object without the `password` and `salt` fields.
     * @code 200 Successfully retrieved the admin.
     * @code 400 Did not provide `rut` or it's malformed.
     * @code 404 No admin exists with that `rut`.
     */
    async get(request, response): Promise<void> {
        const { rut } = request.query;
        if (!rut) {
            sendError(response, HTTPCode.BadRequest, "Expected rut in query.");
            return;
        }

        if (!User.isValidRut(rut)) {
            sendError(response, HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }

        try {
            const admin = await Admin.Model.findById(rut);
            if (!admin) {
                sendError(response, HTTPCode.NotFound, "Admin does not exist.");
                return;
            }

            sendOk(response, omit(Admin.toJSON(admin), ["password", "salt"]));
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to get admin.");
        }
    },
} satisfies EndpointHandler<{
    get: {
        queryKeys: "rut";
        responseData: Omit<Admin.JSON, "password" | "salt">;
    };
}>;

export function hashPassword(password: string, salt: string): string {
    return createHash("sha256").update(password + salt).digest("hex");
}
