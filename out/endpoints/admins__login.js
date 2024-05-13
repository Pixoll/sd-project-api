"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const users_1 = require("./users");
const db_1 = require("../db");
const tokens_1 = require("../tokens");
exports.methods = {
    async post(request, response) {
        const { email, password } = request.body;
        if (!email || !password) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)({ email, password }, db_1.Admin.Model, { partial: true });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const matchingAdmin = await db_1.Admin.Model.findOne({ email });
        if (!matchingAdmin) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Admin does not exist.");
            return;
        }
        const { rut, salt, password: savedPassword } = db_1.Admin.toJSON(matchingAdmin);
        if ((0, users_1.hashPassword)(password, salt) !== savedPassword) {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        (0, base_1.sendOk)(response, {
            "session_token": (0, tokens_1.generateToken)("admin", rut),
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zX19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYWRtaW5zX19sb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBc0U7QUFDdEUsbUNBQXVDO0FBQ3ZDLDhCQUFpRDtBQUNqRCxzQ0FBMEM7QUFFN0IsUUFBQSxPQUFPLEdBQUc7SUFZbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSx1REFBdUQsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsVUFBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkUsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFVBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDakIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEUsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLEdBQUcsVUFBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRSxJQUFJLElBQUEsb0JBQVksRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDakQsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDOUQsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFBLGFBQU0sRUFBQyxRQUFRLEVBQUU7WUFDYixlQUFlLEVBQUUsSUFBQSxzQkFBYSxFQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7U0FDL0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQVdILENBQUMifQ==