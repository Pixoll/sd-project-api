"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const db_1 = require("../db");
const base_1 = require("./base");
const users_1 = require("./users");
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
        const validationResult = (0, db_1.validateStructure)({ email, password }, db_1.User.Model, { partial: true });
        if (validationResult !== true) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult);
            return;
        }
        const matchingUser = await db_1.User.Model.findOne({ email });
        if (!matchingUser) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        const { salt, password: savedPassword } = matchingUser;
        if ((0, users_1.hashPassword)(password, salt) !== savedPassword) {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Wrong password.");
            return;
        }
        (0, base_1.sendOk)(response);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhCQUFnRDtBQUNoRCxpQ0FBOEQ7QUFDOUQsbUNBQXVDO0FBRTFCLFFBQUEsT0FBTyxHQUFHO0lBV25CLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDeEIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFLENBQUM7WUFDekQsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGlEQUFpRCxDQUFDLENBQUM7WUFDNUYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUF1QyxDQUFDO1FBQzVFLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsdURBQXVELENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxzQkFBaUIsRUFBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxTQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0YsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM1QixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUMzRCxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sWUFBWSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNoQixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUMvRCxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxHQUFHLFlBQVksQ0FBQztRQUN2RCxJQUFJLElBQUEsb0JBQVksRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDakQsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDOUQsT0FBTztRQUNYLENBQUM7UUFHRCxJQUFBLGFBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixDQUFDO0NBQ2MsQ0FBQyJ9