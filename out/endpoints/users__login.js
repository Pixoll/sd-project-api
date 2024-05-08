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
        const validationResult = await (0, db_1.validateStructure)({ email, password }, db_1.User.Model, { partial: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX2xvZ2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy91c2Vyc19fbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOEJBQWdEO0FBQ2hELGlDQUE4RDtBQUM5RCxtQ0FBdUM7QUFFMUIsUUFBQSxPQUFPLEdBQUc7SUFXbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN4QixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssa0JBQWtCLEVBQUUsQ0FBQztZQUN6RCxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxVQUFVLEVBQUUsaURBQWlELENBQUMsQ0FBQztZQUM1RixPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQXVDLENBQUM7UUFDNUUsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSx1REFBdUQsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBSSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JHLElBQUksZ0JBQWdCLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0QsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDaEIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDL0QsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsR0FBRyxZQUFZLENBQUM7UUFDdkQsSUFBSSxJQUFBLG9CQUFZLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQ2pELElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlELE9BQU87UUFDWCxDQUFDO1FBR0QsSUFBQSxhQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDckIsQ0FBQztDQUNjLENBQUMifQ==