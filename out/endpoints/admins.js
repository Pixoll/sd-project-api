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
        if ((0, util_1.hasOneOfKeys)(request.body, ["salt", "created_timestamp", "updated_timestamp"])) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Password 'salt', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.Admin.Model, { exclude: ["salt"] });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWlEO0FBQ2pELGlDQUFrRztBQUNsRyw4QkFBdUQ7QUFDdkQsa0NBQTBEO0FBRTdDLFFBQUEsT0FBTyxHQUFHO0lBVW5CLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1AsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDbkUsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3hCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN6RCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNULElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNoRSxPQUFPO1lBQ1gsQ0FBQztZQUVELElBQUEsYUFBTSxFQUFDLFFBQVEsRUFBRSxJQUFBLFdBQUksRUFBQyxVQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVB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