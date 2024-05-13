import { createHash, randomBytes } from "crypto";
import { HTTPCode, EndpointHandler, sendOk, sendCreated, sendNoContent, sendError } from "./base";
import { Admin, User, validateStructure } from "../db";
import { hasOneOfKeys, omit, replaceKeys } from "../util";

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
        const { rut } = request.query as Record<string, string | undefined>;
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

    /**
     * @name Create Admin
     * @description Create a new {schema:Admin}.
     * @body An {schema:Admin} object without the `salt`, `created_timestamp` and `updated_timestamp` fields.
     * @code 201 Successfully created new admin.
     * @code 400 Malformed admin structure.
     * @code 409 An admin with that `rut` already exists.
     */
    async post(request, response): Promise<void> {
        if (hasOneOfKeys(request.body, ["salt", "created_timestamp", "updated_timestamp"])) {
            sendError(
                response,
                HTTPCode.BadRequest,
                "Password 'salt', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request."
            );
            return;
        }

        const validationResult = await validateStructure(request.body, Admin.Model, { exclude: ["salt"] });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
            return;
        }

        const adminJson = request.body as Admin.JSON;

        try {
            const existing = await Admin.Model.findById(adminJson.rut);
            if (existing) {
                sendError(response, HTTPCode.Conflict, "Admin with specified RUT already exists.");
                return;
            }
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to find existing admin.");
            return;
        }

        const salt = randomBytes(16).toString("hex");

        try {
            await new Admin.Model({
                ...replaceKeys(omit(adminJson, ["password"]), { rut: "_id" } as const),
                password: hashPassword(adminJson.password, salt),
                salt,
            }).save();

            sendCreated(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to create new admin.");
        }
    },

    /**
     * @name Delete Admin
     * @description Delete the {schema:Admin} matching the provided `rut`.
     * @query rut | string | RUT of the admin.
     * @code 204 Successfully deleted the admin.
     * @code 400 Did not provide `rut`, or malformed `rut`.
     * @code 404 Admin with that `rut` does not exist.
     */
    async delete(request, response): Promise<void> {
        const { rut } = request.query as Record<string, string | undefined>;
        if (!rut) {
            sendError(response, HTTPCode.BadRequest, "Expected RUT query parameter.");
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

            await admin.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to delete the admin.");
        }
    },
} satisfies EndpointHandler;

export function hashPassword(password: string, salt: string): string {
    return createHash("sha256").update(password + salt).digest("hex");
}
