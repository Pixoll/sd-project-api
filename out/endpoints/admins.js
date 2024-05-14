"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected rut in query.");
            return;
        }
        if (!db_1.User.isValidRut(rut)) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Invalid RUT.");
            return;
        }
        try {
            const admin = await db_1.Admin.Model.findById(rut);
            if (!admin) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Admin does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.Admin.toJSON(admin), ["password", "salt"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get admin.");
        }
    },
};
function hashPassword(password, salt) {
    return (0, crypto_1.createHash)("sha256").update(password + salt).digest("hex");
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9hZG1pbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW9DO0FBQ3BDLGlDQUFzRTtBQUN0RSw4QkFBb0M7QUFDcEMsa0NBQStCO0FBRWxCLFFBQUEsT0FBTyxHQUFHO0lBVW5CLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1AsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDbkUsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3hCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN6RCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNULElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNoRSxPQUFPO1lBQ1gsQ0FBQztZQUVELElBQUEsYUFBTSxFQUFDLFFBQVEsRUFBRSxJQUFBLFdBQUksRUFBQyxVQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsV0FBVyxFQUFFLDZDQUE2QyxDQUFDLENBQUM7UUFDN0YsQ0FBQztJQUNMLENBQUM7Q0FNSCxDQUFDO0FBRUgsU0FBZ0IsWUFBWSxDQUFDLFFBQWdCLEVBQUUsSUFBWTtJQUN2RCxPQUFPLElBQUEsbUJBQVUsRUFBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRkQsb0NBRUMifQ==