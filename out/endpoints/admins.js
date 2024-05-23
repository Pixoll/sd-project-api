"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsEndpoint = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
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
        if (!db_1.User.isValidRut(rut)) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        const admin = await db_1.Admin.Model.findById(rut);
        if (!admin) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, util_1.Util.omit(db_1.Admin.toJSON(admin), ["password", "salt"]));
    }
}
exports.AdminsEndpoint = AdminsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLDhCQUFvQztBQUNwQyxrQ0FBK0I7QUFFL0IsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQUN4QztRQUNJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBY00sS0FBSyxDQUFDLEdBQUcsQ0FDWixPQUF1QyxFQUN2QyxRQUFrRTtRQUVsRSxJQUFJLGVBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDeEQsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDOUUsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDUCxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLFNBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN4QixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMzRSxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUNsRixPQUFPO1FBQ1gsQ0FBQztRQUVELGVBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQUksQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUNKO0FBN0NELHdDQTZDQyJ9