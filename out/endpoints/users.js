"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersEndpoint = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const db_1 = require("../db");
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
        const validationResult = await (0, db_1.validateStructure)(search, db_1.User.Model, { partial: true });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const user = await db_1.User.Model.findOne(util_1.Util.replaceKeys(search, { rut: "_id" }));
        if (!user) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, util_1.Util.omit(db_1.User.toJSON(user), ["password", "salt"]));
    }
    async post(request, response) {
        if (util_1.Util.hasOneOfKeys(request.body, ["salt", "verified", "created_timestamp", "updated_timestamp"])) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Password 'salt', 'verified', 'created_timestamp' and 'updated_timestamp' fields"
                + " may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.User.Model, { exclude: ["salt", "verified"] });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const userJson = request.body;
        const { rut, email, phone } = userJson;
        const existingRut = await db_1.User.Model.findOne({ _id: rut });
        if (existingRut) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified RUT already exists.");
            return;
        }
        const existingEmail = await db_1.User.Model.findOne({ email });
        if (existingEmail) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified email already exists.");
            return;
        }
        const existingPhone = await db_1.User.Model.findOne({ phone });
        if (existingPhone) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Conflict, "User with specified phone number already exists.");
            return;
        }
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        await new db_1.User.Model({
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
        const user = await db_1.User.Model.findById(authorizedUser.rut);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBa0M7QUFDbEMsOEJBQWdEO0FBQ2hELGtDQUErQjtBQUUvQixNQUFhLGFBQWMsU0FBUSxlQUFRO0lBQ3ZDO1FBQ0ksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFnQk0sS0FBSyxDQUFDLEdBQUcsQ0FDWixPQUEwRSxFQUMxRSxRQUFpRTtRQUVqRSxJQUFJLGVBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDeEQsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDOUUsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDM0MsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLDJEQUEyRCxDQUM5RCxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRztZQUNYLEdBQUcsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ2pCLEdBQUcsS0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3JCLEdBQUcsS0FBSyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtTQUN6QyxDQUFDO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsTUFBTSxFQUFFLFNBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBVyxDQUFDLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2pGLE9BQU87UUFDWCxDQUFDO1FBRUQsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQyxTQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBVU0sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFvQyxFQUFFLFFBQTJCO1FBQy9FLElBQUksV0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRyxlQUFRLENBQUMsU0FBUyxDQUNkLFFBQVEsRUFDUixlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFDNUIsaUZBQWlGO2tCQUMvRSx1Q0FBdUMsQ0FDNUMsQ0FBQztZQUNGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5RyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLFFBQVEsQ0FBQztRQUV2QyxNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNkLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLHlDQUF5QyxDQUFDLENBQUM7WUFDcEcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7WUFDdEcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGtEQUFrRCxDQUFDLENBQUM7WUFDN0csT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLElBQUksR0FBRyxJQUFBLG9CQUFXLEVBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdDLE1BQU0sSUFBSSxTQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2pCLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFXLENBQUM7WUFDL0UsUUFBUSxFQUFFLGFBQWEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7WUFDN0QsSUFBSTtTQUNQLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVWLGVBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQVlNLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBeUIsRUFBRSxRQUEyQjtRQUN0RSxNQUFNLGNBQWMsR0FBRyxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxjQUFjLEVBQUUsSUFBSSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDL0UsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDUixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2pGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkIsZUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFnQixFQUFFLElBQVk7UUFDckQsT0FBTyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNKO0FBakpELHNDQWlKQyJ9