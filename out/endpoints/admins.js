"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected rut in query.");
            return;
        }
        if (!db_1.User.isValidRut(rut)) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        try {
            const admin = await db_1.Admin.Model.findById(rut);
            if (!admin) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Admin does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.Admin.toJSON(admin), ["password", "salt"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get admin.");
        }
    },
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        if ((0, util_1.hasKeys)(request.body, ["salt", "created_timestamp", "updated_timestamp"])) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Password 'salt', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.Admin.Model, { exclude: ["salt"] });
        if (validationResult !== true) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult);
            return;
        }
        const adminJson = request.body;
        try {
            const existing = await db_1.Admin.Model.findById(adminJson.rut);
            if (existing) {
                (0, base_1.sendError)(response, base_1.HTTPCode.Conflict, "Admin with specified RUT already exists.");
                return;
            }
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to find existing admin.");
            return;
        }
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        try {
            await new db_1.Admin.Model({
                ...(0, util_1.replaceKeys)((0, util_1.omit)(adminJson, ["password"]), { rut: "_id" }),
                password: hashPassword(adminJson.password, salt),
                salt,
            }).save();
            (0, base_1.sendCreated)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to create new admin.");
        }
    },
    async delete(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }
        if (!db_1.User.isValidRut(rut)) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        try {
            const admin = await db_1.Admin.Model.findById(rut);
            if (!admin) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Admin does not exist.");
                return;
            }
            await admin.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to delete the admin.");
        }
    },
};
function hashPassword(password, salt) {
    return (0, crypto_1.createHash)("sha256").update(password + salt).digest("hex");
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWlEO0FBQ2pELGlDQUEwRjtBQUMxRiw4QkFBdUQ7QUFDdkQsa0NBQXFEO0FBRXhDLFFBQUEsT0FBTyxHQUFHO0lBVW5CLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUEyQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNQLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ25FLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLFNBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN4QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDekQsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDVCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFDaEUsT0FBTztZQUNYLENBQUM7WUFFRCxJQUFBLGFBQU0sRUFBQyxRQUFRLEVBQUUsSUFBQSxXQUFJLEVBQUMsVUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUFDLE9BQU8sS0FBSyxF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