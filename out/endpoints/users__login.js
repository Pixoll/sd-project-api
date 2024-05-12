"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const users_1 = require("./users");
const db_1 = require("../db");
const tokens_1 = require("../tokens");
exports.methods = {
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        const { email, password } = request.body;
        if (!email || !password) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected both email and password in the request body.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)({ email, password }, db_1.User.Model, { partial: true });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        const matchingUser = await db_1.User.Model.findOne({ email });
        if (!matchingUser) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        const { rut, salt, password: savedPassword } = db_1.User.toJSON(matchingUser);
        if ((0, users_1.hashPassword)(password, salt) !== savedPassword) {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        (0, base_1.sendOk)(response, {
            "session_token": (0, tokens_1.generateToken)("user", rut),
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX2xvZ2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy91c2Vyc19fbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQThEO0FBQzlELG1DQUF1QztBQUN2Qyw4QkFBZ0Q7QUFDaEQsc0NBQTBDO0FBRTdCLFFBQUEsT0FBTyxHQUFHO0lBWW5CLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDeEIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFLENBQUM7WUFDekQsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGlEQUFpRCxDQUFDLENBQUM7WUFDNUYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUF1QyxDQUFDO1FBQzVFLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsdURBQXVELENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLHNCQUFpQixFQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFNBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25FLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2hCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQy9ELE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxHQUFHLFNBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekUsSUFBSSxJQUFBLG9CQUFZLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQ2pELElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlELE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFO1lBQ2IsZUFBZSxFQUFFLElBQUEsc0JBQWEsRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO1NBQzlDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDYyxDQUFDIn0=