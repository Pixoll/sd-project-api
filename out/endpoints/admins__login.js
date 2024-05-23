"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsLoginEndpoint = void 0;
const base_1 = require("./base");
const users_1 = require("./users");
const db_1 = require("../db");
const tokens_1 = require("../tokens");
class AdminsLoginEndpoint extends base_1.Endpoint {
    constructor() {
        super("/admins/login");
    }
    async post(request, response) {
        const { email, password } = request.body;
        if (!email || !password) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)({ email, password }, db_1.Admin.Model, { partial: true });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const matchingAdmin = await db_1.Admin.Model.findOne({ email });
        if (!matchingAdmin) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }
        const { rut, salt, password: savedPassword } = db_1.Admin.toJSON(matchingAdmin);
        if (users_1.UsersEndpoint.hashPassword(password, salt) !== savedPassword) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        base_1.Endpoint.sendOk(response, {
            "session_token": (0, tokens_1.generateToken)("admin", rut),
        });
    }
}
exports.AdminsLoginEndpoint = AdminsLoginEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zX19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYWRtaW5zX19sb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBa0M7QUFDbEMsbUNBQXdDO0FBQ3hDLDhCQUFpRDtBQUNqRCxzQ0FBMEM7QUFFMUMsTUFBYSxtQkFBb0IsU0FBUSxlQUFRO0lBQzdDO1FBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFhTSxLQUFLLENBQUMsSUFBSSxDQUNiLE9BQThELEVBQzlELFFBQXNEO1FBRXRELE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLHVEQUF1RCxDQUMxRCxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSxzQkFBaUIsRUFBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ2pCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDbEYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLEdBQUcsVUFBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRSxJQUFJLHFCQUFhLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxhQUFhLEVBQUUsQ0FBQztZQUMvRCxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2hGLE9BQU87UUFDWCxDQUFDO1FBRUQsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDdEIsZUFBZSxFQUFFLElBQUEsc0JBQWEsRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO1NBQy9DLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXBERCxrREFvREMifQ==