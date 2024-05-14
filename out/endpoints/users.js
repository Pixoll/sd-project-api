"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(request, response) {
        if ((0, base_1.getAuthorizedUser)(request)?.type !== "admin") {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected only one of either rut, email or phone in query.");
            return;
        }
        const search = {
            ...rut && { rut },
            ...email && { email },
            ...phone && { phone: parseInt(phone) },
        };
        const validationResult = await (0, db_1.validateStructure)(search, db_1.User.Model, { partial: true });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        try {
            const user = await db_1.User.Model.findOne((0, util_1.replaceKeys)(search, { rut: "_id" }));
            if (!user) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password", "salt"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get user.");
        }
    },
    async post(request, response) {
        if ((0, util_1.hasOneOfKeys)(request.body, ["salt", "verified", "created_timestamp", "updated_timestamp"])) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Password 'salt', 'verified', 'created_timestamp' and 'updated_timestamp' fields"
                + " may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.User.Model, { exclude: ["salt", "verified"] });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
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
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        try {
            await new db_1.User.Model({
                ...(0, util_1.replaceKeys)((0, util_1.omit)(userJson, ["password"]), { rut: "_id" }),
                password: hashPassword(userJson.password, salt),
                salt,
            }).save();
            (0, base_1.sendCreated)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to create new user.");
        }
    },
    async delete(request, response) {
        const authorizedUser = (0, base_1.getAuthorizedUser)(request);
        if (authorizedUser?.type !== "user") {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        try {
            const user = await db_1.User.Model.findById(authorizedUser.rut);
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
function hashPassword(password, salt) {
    return (0, crypto_1.createHash)("sha256").update(password + salt).digest("hex");
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBcUg7QUFDckgsOEJBQWdEO0FBQ2hELGtDQUEwRDtBQUU3QyxRQUFBLE9BQU8sR0FBRztJQWVuQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3ZCLElBQUksSUFBQSx3QkFBaUIsRUFBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDL0MsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzVELE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM1QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNDLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSwyREFBMkQsQ0FBQyxDQUFDO1lBQ3RHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUc7WUFDWCxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNqQixHQUFHLEtBQUssSUFBSSxFQUFFLEtBQUssRUFBRTtZQUNyQixHQUFHLEtBQUssSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7U0FDekMsQ0FBQztRQUNGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLHNCQUFpQixFQUFDLE1BQU0sRUFBRSxTQUFJLENB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