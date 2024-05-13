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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBMEY7QUFDMUYsOEJBQWdEO0FBQ2hELGtDQUEwRDtBQUU3QyxRQUFBLE9BQU8sR0FBRztJQVluQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUEyQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDM0MsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLDJEQUEyRCxDQUFDLENBQUM7WUFDdEcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRztZQUNYLEdBQUcsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ2pCLEdBQUcsS0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3JCLEdBQUcsS0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtTQUN6QyxDQUFDO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsTUFBTSxFQUFFLFNBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFD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