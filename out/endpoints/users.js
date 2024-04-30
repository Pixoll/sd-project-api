"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(_, response) {
        try {
            const users = await db_1.User.Model.find({}).then(users => users.map(user => (0, util_1.omit)(db_1.User.toJSON(user), ["password"])));
            (0, base_1.sendOk)(response, users);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to get users.");
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUEwRDtBQUMxRCw4QkFBNkI7QUFDN0Isa0NBQStCO0FBRWxCLFFBQUEsT0FBTyxHQUFHO0lBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVE7UUFDakIsSUFBSSxDQUFDO1lBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDakQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNiLElBQUEsV0FBSSxFQUFDLFNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUN4QyxDQUNKLENBQUM7WUFDRixJQUFBLGFBQU0sRUFBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUEsc0JBQWUsRUFBQyxRQUFRLEVBQUUsNkNBQTZDLENBQUMsQ0FBQztRQUM3RSxDQUFDO0lBQ0wsQ0FBQztDQUNjLENBQUMifQ==