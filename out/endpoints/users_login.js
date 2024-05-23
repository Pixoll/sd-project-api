"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersLoginEndpoint = void 0;
const base_1 = require("./base");
const users_1 = require("./users");
const validator_1 = require("../schemas/validator");
const user_1 = require("../schemas/user");
const tokens_1 = require("../tokens");
class UsersLoginEndpoint extends base_1.Endpoint {
    constructor() {
        super("/users/login");
    }
    async post(request, response) {
        const { email, password } = request.body;
        if (!email || !password) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }
        const validationResult = await validator_1.StructureValidator.run({ email, password }, user_1.User.Model, { partial: true });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const matchingUser = await user_1.User.Model.findOne({ email });
        if (!matchingUser) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        const { rut, salt, password: savedPassword } = user_1.User.toJSON(matchingUser);
        if (users_1.UsersEndpoint.hashPassword(password, salt) !== savedPassword) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        base_1.Endpoint.sendOk(response, {
            "session_token": tokens_1.TokenManager.generateToken("user", rut),
        });
    }
}
exports.UsersLoginEndpoint = UsersLoginEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfbG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzX2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFrQztBQUNsQyxtQ0FBd0M7QUFDeEMsb0RBQTBEO0FBQzFELDBDQUF1QztBQUN2QyxzQ0FBeUM7QUFFekMsTUFBYSxrQkFBbUIsU0FBUSxlQUFRO0lBQzVDO1FBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFhTSxLQUFLLENBQUMsSUFBSSxDQUNiLE9BQThELEVBQzlELFFBQXNEO1FBRXRELE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLHVEQUF1RCxDQUMxRCxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sOEJBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRyxNQUFNLFdBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDaEIsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUNqRixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsR0FBRyxXQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pFLElBQUkscUJBQWEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQy9ELGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDaEYsT0FBTztRQUNYLENBQUM7UUFFRCxlQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUN0QixlQUFlLEVBQUUscUJBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztTQUMzRCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFwREQsZ0RBb0RDIn0=