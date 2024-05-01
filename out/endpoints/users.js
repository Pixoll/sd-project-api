"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(request, response) {
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected only one of either rut, email or phone in query.");
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
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get user.");
        }
    },
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        const validationResult = (0, db_1.validateStructure)(request.body, db_1.User.Model);
        if (validationResult !== true) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult);
            return;
        }
        const userJson = request.body;
        const { rut, email, phone } = userJson;
        try {
            const existingRut = await db_1.User.Model.findOne({ _id: rut });
            if (existingRut) {
                (0, base_1.sendError)(response, base_1.HTTPCode.Conflict, "User with specified RUT already exists.");
                return;
            }
            const existingEmail = await db_1.User.Model.findOne({ email });
            if (existingEmail) {
                (0, base_1.sendError)(response, base_1.HTTPCode.Conflict, "User with specified email already exists.");
                return;
            }
            const existingPhone = await db_1.User.Model.findOne({ phone });
            if (existingPhone) {
                (0, base_1.sendError)(response, base_1.HTTPCode.Conflict, "User with specified phone number already exists.");
                return;
            }
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to find existing user.");
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
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to add new user.");
        }
    },
    async delete(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected RUT query parameter.");
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
                return;
            }
            await user.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to delete the user.");
        }
    },
};
function hashPassword(string) {
    return (0, crypto_1.createHash)("sha256").update(string).digest("hex");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQUNwQyxpQ0FTZ0I7QUFDaEIsOEJBQWdEO0FBQ2hELGtDQUEyQztBQUU5QixRQUFBLE9BQU8sR0FBRztJQUNuQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUEyQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDM0MsSUFBQSxxQkFBYyxFQUFDLFFBQVEsRUFBRSwyREFBMkQsQ0FBQyxDQUFDO1lBQ3RGLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDbEMsR0FBRyxFQUFFO29CQUNELEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUU7b0JBQzdCLEVBQUUsS0FBSyxFQUFFO29CQUNULEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEVBQUU7aUJBQ3BDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLElBQUEsbUJBQVksRUFBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDL0MsT0FBTztZQUNYLENBQUM7WUFFRCxJQUFBLGFBQU0sRUFBQyxRQUFRLEVBQUUsSUFBQSxXQUFJLEVBQUMsU0FBSSxDQUFD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