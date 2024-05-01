"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(_, response, next) {
        try {
            const users = await db_1.User.Model.find({}).then(users => users.map(user => (0, util_1.omit)(db_1.User.toJSON(user), ["password"])));
            (0, base_1.sendOk)(response, users);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to get users.");
        }
        next();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUEwRDtBQUMxRCw4QkFBNkI7QUFDN0Isa0NBQStCO0FBRWxCLFFBQUEsT0FBTyxHQUFHO0lBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJO1FBQ3ZCLElBQUksQ0FBQztZQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQ2pELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDYixJQUFBLFdBQUksRUFBQyxTQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDeEMsQ0FDSixDQUFDO1lBRUYsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFBLHNCQUFlLEVBQUMsUUFBUSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUVELElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQztDQUNjLENBQUMifQ==