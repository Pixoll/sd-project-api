"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.methods = void 0;
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
            const user = await db_1.User.Model.findById(rut);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBa0c7QUFDbEcsOEJBQWdEO0FBQ2hELGtDQUEwRDtBQUU3QyxRQUFBLE9BQU8sR0FBRztJQVluQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMzQyxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsMkRBQTJELENBQUMsQ0FBQztZQUN0RyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHO1lBQ1gsR0FBRyxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDakIsR0FBRyxLQUFLLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDckIsR0FBRyxLQUFLLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1NBQ3pDLENBQUM7UUFDRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSxzQkFBaUIsRUFBQyxNQUFNLEVBQUUsU0FBSSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMs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