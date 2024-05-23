"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsEndpoint = void 0;
const base_1 = require("./base");
const admin_1 = require("../schemas/admin");
const user_1 = require("../schemas/user");
const util_1 = require("../util");
class AdminsEndpoint extends base_1.Endpoint {
    constructor() {
        super("/admins");
    }
    async get(request, response) {
        if (base_1.Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }
        const { rut } = request.query;
        if (!rut) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected rut in query.");
            return;
        }
        if (!user_1.User.isValidRut(rut)) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        const admin = await admin_1.Admin.Model.findById(rut);
        if (!admin) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, util_1.Util.omit(admin_1.Admin.toJSON(admin), ["password", "salt"]));
    }
}
exports.AdminsEndpoint = AdminsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLDRDQUF5QztBQUN6QywwQ0FBdUM7QUFDdkMsa0NBQStCO0FBRS9CLE1BQWEsY0FBZSxTQUFRLGVBQVE7SUFDeEM7UUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQWNNLEtBQUssQ0FBQyxHQUFHLENBQ1osT0FBdUMsRUFDdkMsUUFBa0U7UUFFbEUsSUFBSSxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3hELGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlFLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1AsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUNyRixPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxXQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDM0UsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLGFBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDbEYsT0FBTztRQUNYLENBQUM7UUFFRCxlQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Q0FDSjtBQTdDRCx3Q0E2Q0MifQ==