"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const crypto_1 = require("crypto");
const base_1 = require("./base");
const util_1 = require("../util");
const db_1 = require("../db");
exports.methods = {
    async get(request, response) {
        const { rut, email, phone } = request.query;
        if ((+!!rut) + (+!!email) + (+!!phone) !== 1) {
            (0, base_1.sendBadRequest)(response, "Expected only one of either rut, email or phone in query.");
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({
                $or: [
                    { _id: parseInt(rut ?? "0") },
                    { email },
                    { phone: parseInt(phone ?? "0") },
                ],
            });
            if (!user) {
                (0, base_1.sendNotFound)(response, "User does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, (0, util_1.omit)(db_1.User.toJSON(user), ["password"]));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to get user.");
            return;
        }
    },
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendBadRequest)(response, "Content-Type header must be 'application/json'.");
            return;
        }
        const validationResult = (0, db_1.validateStructure)(request.body, db_1.User.Model);
        if (validationResult !== true) {
            (0, base_1.sendBadRequest)(response, validationResult);
            return;
        }
        const userJson = /** @type {import("../db/schemas").UserJSON} */ (request.body);
        const { rut, email, phone } = userJson;
        try {
            const existingRut = await db_1.User.Model.findOne({ _id: rut });
            if (existingRut) {
                (0, base_1.sendConflict)(response, "Usuario con ese RUT ya existe.");
                return;
            }
            const existingEmail = await db_1.User.Model.findOne({ email });
            if (existingEmail) {
                (0, base_1.sendConflict)(response, "Usuario con ese email ya existe.");
                return;
            }
            const existingPhone = await db_1.User.Model.findOne({ phone });
            if (existingPhone) {
                (0, base_1.sendConflict)(response, "Usuario con ese número de teléfono ya existe.");
                return;
            }
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to find existing user.");
            return;
        }
        try {
            await new db_1.User.Model({
                ...(0, util_1.replaceKey)((0, util_1.omit)(userJson, ["password"]), "rut", "_id"),
                password: hashPassword(userJson.password),
            }).save();
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to add new user.");
            return;
        }
        (0, base_1.sendCreated)(response);
    },
    async delete(request, response) {
        const { rut } = request.query;
        if (!rut) {
            (0, base_1.sendBadRequest)(response, "Expected RUT query parameter.");
            return;
        }
        try {
            const user = await db_1.User.Model.findOne({ _id: parseInt(rut ?? "0") });
            if (!user) {
                (0, base_1.sendNotFound)(response, "User does not exist.");
                return;
            }
            await user.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendServerError)(response, "Unexpected error while trying to delete the user.");
            return;
        }
    },
};
function hashPassword(string) {
    return (0, crypto_1.createHash)("sha256").update(string).digest("hex");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBb0M7QUFDcEMsaUNBU2dCO0FBQ2hCLGtDQUEyQztBQUMzQyw4QkFBZ0Q7QUFFbkMsUUFBQSxPQUFPLEdBQUc7SUFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN2QixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBMkMsQ0FBQztRQUNsRixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNDLElBQUEscUJBQWMsRUFBQyxRQUFRLEVBQUUsMkRBQTJELENBQUMsQ0FBQztZQUN0RixPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLEdBQUcsRUFBRTtvQkFDRCxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixFQUFFLEtBQUssRUFBRTtvQkFDVCxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2lCQUNwQzthQUNKLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixJQUFBLG1CQUFZLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQy9DLE9BQU87WUFDWCxDQUFDO1lBRUQsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUEsc0JBQWUsRUFBQyxRQUFRLEVBQUUsNENBQTRDLENBQUMsQ0FBQztZQUN4RSxPQUFPO1FBQ1gsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3hCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELElBQUEscUJBQWMsRUFBQyxRQUFRLEVBQUUsaURBQWlELENBQUMsQ0FBQztZQUM1RSxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxzQkFBaUIsRUFBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRSxJQUFJLGdCQUFnQixLQUFLLElBQUksRUFBRSxDQUFDO1lBQzVCLElBQUEscUJBQWMsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUMzQyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLCtDQUErQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLFFBQVEsQ0FBQztRQUV2QyxJQUFJLENBQUM7WUFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxXQUFXLEVBQUUsQ0FBQztnQkFDZCxJQUFBLG1CQUFZLEVBQUMsUUFBUSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7Z0JBQ3pELE9BQU87WUFDWCxDQUFDO1lBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxTQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDMUQsSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDaEIsSUFBQSxtQkFBWSxFQUFDLFFBQVEsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPO1lBQ1gsQ0FBQztZQUVELE1BQU0sYUFBYSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzFELElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLElBQUEsbUJBQVksRUFBQyxRQUFRLEVBQUUsK0NBQStDLENBQUMsQ0FBQztnQkFDeEUsT0FBTztZQUNYLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBQSxzQkFBZSxFQUFDLFFBQVEsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO1lBQ2xGLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFJLFNBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLEdBQUcsSUFBQSxpQkFBVSxFQUFDLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztnQkFDekQsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQzVDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFBLHNCQUFlLEVBQUMsUUFBUSxFQUFFLGdEQUFnRCxDQUFDLENBQUM7WUFDNUUsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFBLGtCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDMUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUEyQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNQLElBQUEscUJBQWMsRUFBQyxRQUFRLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUMxRCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLElBQUEsbUJBQVksRUFBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDL0MsT0FBTztZQUNYLENBQUM7WUFFRCxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixJQUFBLG9CQUFhLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUEsc0JBQWUsRUFBQyxRQUFRLEVBQUUsbURBQW1ELENBQUMsQ0FBQztZQUMvRSxPQUFPO1FBQ1gsQ0FBQztJQUNMLENBQUM7Q0FDYyxDQUFDO0FBRXBCLFNBQVMsWUFBWSxDQUFDLE1BQWM7SUFDaEMsT0FBTyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCxDQUFDIn0=