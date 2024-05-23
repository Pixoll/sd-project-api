"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersEndpoint = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const user_1 = require("../schemas/user");
const validator_1 = require("../schemas/validator");
const util_1 = require("../util");
class UsersEndpoint extends base_1.Endpoint {
    constructor() {
        super("/users");
    }
    async get(request, response) {
        if (base_1.Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected only one of either rut, email or phone in query.");
            return;
        }
        const search = {
            ...rut && { rut },
            ...email && { email },
            ...phone && { phone: parseInt(phone) },
        };
        const validationResult = await validator_1.StructureValidator.run(search, user_1.User.Model, { partial: true });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const user = await user_1.User.Model.findOne(util_1.Util.replaceKeys(search, { rut: "_id" }));
        if (!user) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, util_1.Util.omit(user_1.User.toJSON(user), ["password", "salt"]));
    }
    async post(request, response) {
        if (util_1.Util.hasOneOfKeys(request.body, ["salt", "verified", "created_timestamp", "updated_timestamp"])) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Password 'salt', 'verified', 'created_timestamp' and 'updated_timestamp' fields"
                + " may not be specified in the request.");
            return;
        }
        const validationResult = await validator_1.StructureValidator.run(request.body, user_1.User.Model, { exclude: ["salt", "verified"] });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const userJson = request.body;
        const { rut, email, phone } = userJson;
        const existingRut = await user_1.User.Model.findOne({ _id: rut });
        if (existingRut) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified RUT already exists.");
            return;
        }
        const existingEmail = await user_1.User.Model.findOne({ email });
        if (existingEmail) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified email already exists.");
            return;
        }
        const existingPhone = await user_1.User.Model.findOne({ phone });
        if (existingPhone) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified phone number already exists.");
            return;
        }
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        await new user_1.User.Model({
            ...util_1.Util.replaceKeys(util_1.Util.omit(userJson, ["password"]), { rut: "_id" }),
            password: UsersEndpoint.hashPassword(userJson.password, salt),
            salt,
        }).save();
        base_1.Endpoint.sendCreated(response);
    }
    async delete(request, response) {
        const authorizedUser = base_1.Endpoint.getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        const user = await user_1.User.Model.findById(authorizedUser.rut);
        if (!user) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        await user.deleteOne();
        base_1.Endpoint.sendNoContent(response);
    }
    static hashPassword(password, salt) {
        return (0, crypto_1.createHash)("sha256").update(password + salt).digest("hex");
    }
}
exports.UsersEndpoint = UsersEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBa0M7QUFDbEMsMENBQXVDO0FBQ3ZDLG9EQUEwRDtBQUMxRCxrQ0FBK0I7QUFFL0IsTUFBYSxhQUFjLFNBQVEsZUFBUTtJQUN2QztRQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBZ0JNLEtBQUssQ0FBQyxHQUFHLENBQ1osT0FBd0QsRUFDeEQsUUFBaUU7UUFFakUsSUFBSSxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3hELGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlFLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM1QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNDLGVBQVEsQ0FBQyxTQUFTLENBQ2QsUUFBUSxFQUNSLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUM1QiwyREFBMkQsQ0FDOUQsQ0FBQztZQUNGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUc7WUFDWCxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNqQixHQUFHLEtBQUssSUFBSSxFQUFFLEtBQUssRUFBRTtZQUNyQixHQUFHLEtBQUssSUFBSSxFQUFFLEtBQUss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