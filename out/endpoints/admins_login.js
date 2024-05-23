"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsLoginEndpoint = void 0;
const base_1 = require("./base");
const users_1 = require("./users");
const admin_1 = require("../schemas/admin");
const validator_1 = require("../schemas/validator");
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
        const validationResult = await validator_1.StructureValidator.run({ email, password }, admin_1.Admin.Model, { partial: true });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const matchingAdmin = await admin_1.Admin.Model.findOne({ email });
        if (!matchingAdmin) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }
        const { rut, salt, password: savedPassword } = admin_1.Admin.toJSON(matchingAdmin);
        if (users_1.UsersEndpoint.hashPassword(password, salt) !== savedPassword) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        base_1.Endpoint.sendOk(response, {
            "session_token": tokens_1.TokenManager.generateToken("admin", rut),
        });
    }
}
exports.AdminsLoginEndpoint = AdminsLoginEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zX2xvZ2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnNfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLG1DQUF3QztBQUN4Qyw0Q0FBeUM7QUFDekMsb0RBQTBEO0FBQzFELHNDQUF5QztBQUV6QyxNQUFhLG1CQUFvQixTQUFRLGVBQVE7SUFDN0M7UUFDSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQWFNLEtBQUssQ0FBQyxJQUFJLENBQ2IsT0FBOEQsRUFDOUQsUUFBc0Q7UUFFdEQsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixlQUFRLENBQUMsU0FBUyxDQUNkLFFBQVEsRUFDUixlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFDNUIsdURBQXVELENBQzFELENBQUM7WUFDRixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSw4QkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sYUFBYSxHQUFHLE1BQU0sYUFBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqQixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2xGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0UsSUFBSSxxQkFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDL0QsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNoRixPQUFPO1FBQ1gsQ0FBQztRQUVELGVBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3RCLGVBQWUsRUFBRSxxQkFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO1NBQzVELENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXBERCxrREFvREMifQ==