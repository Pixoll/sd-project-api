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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zX19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYWRtaW5zX19sb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBOEQ7QUFDOUQsbUNBQXVDO0FBQ3ZDLDhCQUFpRDtBQUNqRCxzQ0FBMEM7QUFFN0IsUUFBQSxPQUFPLEdBQUc7SUFZbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUF1QyxDQUFDO1FBQzVFLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsdURBQXVELENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLHNCQUFpQixFQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFVBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25FLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ2pCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2hFLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxHQUFHLFVBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0UsSUFBSSxJQUFBLG9CQUFZLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQ2pELElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlELE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFO1lBQ2IsZUFBZSxFQUFFLElBQUEsc0JBQWEsRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO1NBQy9DLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDYyxDQUFDIn0=