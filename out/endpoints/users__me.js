"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMeEndpoint = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
class UsersMeEndpoint extends base_1.Endpoint {
    constructor() {
        super("/users/me");
    }
    async get(request, response) {
        const authorizedUser = base_1.Endpoint.getAuthorizedUser(request);
        if (authorizedUser?.type !== "user") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        const user = await db_1.User.Model.findById(authorizedUser.rut);
        if (!user) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "User does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, util_1.Util.omit(db_1.User.toJSON(user), ["password", "salt"]));
    }
}
exports.UsersMeEndpoint = UsersMeEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfX21lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy91c2Vyc19fbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLDhCQUE2QjtBQUM3QixrQ0FBK0I7QUFFL0IsTUFBYSxlQUFnQixTQUFRLGVBQVE7SUFDekM7UUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQVlNLEtBQUssQ0FBQyxHQUFHLENBQ1osT0FBeUIsRUFDekIsUUFBaUU7UUFFakUsTUFBTSxjQUFjLEdBQUcsZUFBUSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELElBQUksY0FBYyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9FLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1IsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUNqRixPQUFPO1FBQ1gsQ0FBQztRQUVELGVBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQUksQ0FBQyxJQUFJLENBQUMsU0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztDQUNKO0FBakNELDBDQWlDQyJ9