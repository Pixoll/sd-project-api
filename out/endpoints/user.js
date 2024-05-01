"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const util_1 = require("../util");
const db_1 = require("../db");
exports.methods = {
    async get(request, response) {
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            (0, base_1.sendBadRequest)(response, "Expected only one of either rut, email or phone in query.");
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({
                $or: [
                    { _id: parseInt(rut ?? "0") },
                    { email },
                    { phone: parseInt(phone ?? "0") },
                ],
            });
            if (!user) {
                (0, base_1.sendNotFound)(response, "User does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to get user.");
        }
    },
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendBadRequest)(response, "Content-Type header must be 'application/json'.");
            return;
        }
        const validationResult = (0, db_1.validateStructure)(request.body, db_1.User.Model);
        if (validationResult !== true) {
            (0, base_1.sendBadRequest)(response, validationResult);
            return;
        }
        const userJson = request.body;
        const { rut, email, phone } = userJson;
        try {
            const existingRut = await db_1.User.Model.findOne({ _id: rut });
            if (existingRut) {
                (0, base_1.sendConflict)(response, "Usuario con ese RUT ya existe.");
                return;
            }
            const existingEmail = await db_1.User.Model.findOne({ email });
            if (existingEmail) {
                (0, base_1.sendConflict)(response, "Usuario con ese email ya existe.");
                return;
            }
            const existingPhone = await db_1.User.Model.findOne({ phone });
            if (existingPhone) {
                (0, base_1.sendConflict)(response, "Usuario con ese número de teléfono ya existe.");
                return;
            }
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to find existing user.");
            return;
        }
        try {
            await new db_1.User.Model({
                ...(0, util_1.replaceKey)((0, util_1.omit)(userJson, ["password"]), "rut", "_id"),
                password: hashPassword(userJson.password),
            }).save();
            (0, base_1.sendCreated)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to add new user.");
        }
    },
    async delete(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendBadRequest)(response, "Expected RUT query parameter.");
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                (0, base_1.sendNotFound)(response, "User does not exist.");
                return;
            }
            await user.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to delete the user.");
        }
    },
};
function hashPassword(string) {
    return (0, crypto_1.createHash)("sha256").update(string).digest("hex");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBb0M7QUFDcEMsaUNBU2dCO0FBQ2hCLGtDQUEyQztBQUMzQyw4QkFBZ0Q7QUFFbkMsUUFBQSxPQUFPLEdBQUc7SUFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN2QixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBMkMsQ0FBQztRQUNsRixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNDLElBQUEscUJBQWMsRUFBQyxRQUFRLEVBQUUsMkRBQTJELENBQUMsQ0FBQztZQUN0RixPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLEdBQUcsRUFBRTtvQkFDRCxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixFQUFFLEtBQUssRUFBRTtvQkFDVCxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2lCQUNwQzthQUNKLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixJQUFBLG1CQUFZLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQy9DLE9BQU87WUFDWCxDQUFDO1lBRUQsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQUksQ0FBQyxN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