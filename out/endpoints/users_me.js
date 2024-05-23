"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMeEndpoint = void 0;
const base_1 = require("./base");
const user_1 = require("../schemas/user");
const util_1 = require("../util");
class UsersMeEndpoint extends base_1.Endpoint {
    constructor() {
        super("/users/me");
    }
    async get(request, response) {
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
        base_1.Endpoint.sendOk(response, util_1.Util.omit(user_1.User.toJSON(user), ["password", "salt"]));
    }
}
exports.UsersMeEndpoint = UsersMeEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzX21lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFrQztBQUNsQywwQ0FBdUM7QUFDdkMsa0NBQStCO0FBRS9CLE1BQWEsZUFBZ0IsU0FBUSxlQUFRO0lBQ3pDO1FBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFZTSxLQUFLLENBQUMsR0FBRyxDQUNaLE9BQXlCLEVBQ3pCLFFBQWlFO1FBRWpFLE1BQU0sY0FBYyxHQUFHLGVBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxJQUFJLGNBQWMsRUFBRSxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDbEMsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUMvRSxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sV0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDakYsT0FBTztRQUNYLENBQUM7UUFFRCxlQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLFdBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Q0FDSjtBQWpDRCwwQ0FpQ0MifQ==