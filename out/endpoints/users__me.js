"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const db_1 = require("../db");
const util_1 = require("../util");
const base_1 = require("./base");
exports.methods = {
    async get(request, response) {
        const authorizedUser = (0, base_1.getAuthorizedUser)(request);
        if (authorizedUser?.type !== "user") {
            (0, base_1.sendError)(response, base_1.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        const user = await db_1.User.Model.findById(authorizedUser.rut);
        if (!user) {
            (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password", "salt"]));
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX21lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy91c2Vyc19fbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOEJBQTZCO0FBQzdCLGtDQUErQjtBQUMvQixpQ0FBeUY7QUFFNUUsUUFBQSxPQUFPLEdBQUc7SUFXbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN2QixNQUFNLGNBQWMsR0FBRyxJQUFBLHdCQUFpQixFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUM3RCxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNSLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQy9ELE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FLSCxDQUFDIn0=