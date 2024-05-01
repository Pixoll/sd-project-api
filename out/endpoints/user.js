"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const util_1 = require("../util");
const db_1 = require("../db");
exports.methods = {
    async get(request, response, next) {
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            (0, base_1.sendBadRequest)(response, "Expected only one of either rut, email or phone in query.");
            next();
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
                next();
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to get user.");
        }
        next();
    },
    async post(request, response, next) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendBadRequest)(response, "Content-Type header must be 'application/json'.");
            next();
            return;
        }
        const validationResult = (0, db_1.validateStructure)(request.body, db_1.User.Model);
        if (validationResult !== true) {
            (0, base_1.sendBadRequest)(response, validationResult);
            next();
            return;
        }
        const userJson = request.body;
        const { rut, email, phone } = userJson;
        try {
            const existingRut = await db_1.User.Model.findOne({ _id: rut });
            if (existingRut) {
                (0, base_1.sendConflict)(response, "Usuario con ese RUT ya existe.");
                next();
                return;
            }
            const existingEmail = await db_1.User.Model.findOne({ email });
            if (existingEmail) {
                (0, base_1.sendConflict)(response, "Usuario con ese email ya existe.");
                next();
                return;
            }
            const existingPhone = await db_1.User.Model.findOne({ phone });
            if (existingPhone) {
                (0, base_1.sendConflict)(response, "Usuario con ese número de teléfono ya existe.");
                next();
                return;
            }
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to find existing user.");
            next();
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
        next();
    },
    async delete(request, response, next) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendBadRequest)(response, "Expected RUT query parameter.");
            next();
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                (0, base_1.sendNotFound)(response, "User does not exist.");
                next();
                return;
            }
            await user.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to delete the user.");
        }
        next();
    },
};
function hashPassword(string) {
    return (0, crypto_1.createHash)("sha256").update(string).digest("hex");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBb0M7QUFDcEMsaUNBU2dCO0FBQ2hCLGtDQUEyQztBQUMzQyw4QkFBZ0Q7QUFFbkMsUUFBQSxPQUFPLEdBQUc7SUFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUk7UUFDN0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQTJDLENBQUM7UUFDbEYsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMzQyxJQUFBLHFCQUFjLEVBQUMsUUFBUSxFQUFFLDJEQUEyRCxDQUFDLENBQUM7WUFDdEYsSUFBSSxFQUFFLENBQUM7WUFDUCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLEdBQUcsRUFBRTtvQkFDRCxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixFQUFFLEtBQUssRUFBRTtvQkFDVCxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2lCQUNwQzthQUNKLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixJQUFBLG1CQUFZLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQy9DLElBQUksRUFBRSxDQUFDO2dCQUNQLE9BQU87WUFDWCxDQUFDO1lBRUQs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