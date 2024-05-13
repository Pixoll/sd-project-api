"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
exports.methods = {
    async get(request, response) {
        const { id } = request.query;
        if (!id) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }
        try {
            const shipment = await db_1.Shipment.Model.findById(id);
            if (!shipment) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Shipment does not exist.");
                return;
            }
            (0, base_1.sendOk)(response, db_1.Shipment.toJSON(shipment));
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get shipment.");
        }
    },
    async post(request, response) {
        if ((0, util_1.hasOneOfKeys)(request.body, ["id", "created_timestamp", "updated_timestamp"])) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Shipment 'id', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.Shipment.Model, { exclude: ["id"] });
        if (!validationResult.ok) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        try {
            await new db_1.Shipment.Model(request.body).save();
            (0, base_1.sendCreated)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to crate new shipment.");
        }
    },
    async delete(request, response) {
        const { id } = request.query;
        if (!id) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }
        try {
            const shipment = await db_1.Shipment.Model.findById(id);
            if (!shipment) {
                (0, base_1.sendError)(response, base_1.HTTPCode.NotFound, "Shipment does not exist.");
                return;
            }
            await shipment.deleteOne();
            (0, base_1.sendNoContent)(response);
        }
        catch (error) {
            console.error(error);
            (0, base_1.sendError)(response, base_1.HTTPCode.ServerError, "Unexpected error while trying to get shipment.");
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpcG1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9zaGlwbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBGO0FBQzFGLDhCQUFvRDtBQUNwRCxrQ0FBdUM7QUFFMUIsUUFBQSxPQUFPLEdBQUc7SUFVbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUN2QixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQXdDLENBQUM7UUFDaEUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ04sSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7WUFDL0UsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDWixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFDbkUsT0FBTztZQUNYLENBQUM7WUFFRCxJQUFBLGFBQU0sRUFBQyxRQUFRLEVBQUUsYUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxXQUFXLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztRQUNoRyxDQUFDO0lBQ0wsQ0FBQztJQVNELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDeEIsSUFBSSxJQUFBLG1CQUFZLEVBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMvRSxJQUFBLGdCQUFTLEVBQ0wsUUFBUSxFQUNSLGVBQVEsQ0FBQyxVQUFVLEVBQ25CLHdHQUF3RyxDQUMzRyxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSxzQkFBaUIsRUFBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRSxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQztZQUNELE1BQU0sSUFBSSxhQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUU5QyxJQUFBLGtCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFdBQVcsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO1FBQ3RHLENBQUM7SUFDTCxDQUFDO0lBVUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUMxQixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQXdDLENBQUM7UUFDaEUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ04sSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7WUFDL0UsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDWixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFDbkUsT0FBTztZQUNYLENBQUM7WUFFRCxNQUFNLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMzQixJQUFBLG9CQUFhLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFdBQVcsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO1FBQ2hHLENBQUM7SUFDTCxDQUFDO0NBS2MsQ0FBQyJ9