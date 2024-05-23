"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsEndpoint = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
const util_1 = require("../util");
class ShipmentsEndpoint extends base_1.Endpoint {
    constructor() {
        super("/shipments");
    }
    async get(request, response) {
        const { id } = request.query;
        if (!id) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }
        const shipment = await db_1.Shipment.Model.findById(id);
        if (!shipment) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, db_1.Shipment.toJSON(shipment));
    }
    async post(request, response) {
        if (!base_1.Endpoint.getAuthorizedUser(request)) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }
        if (util_1.Util.hasOneOfKeys(request.body, ["id", "created_timestamp", "updated_timestamp"])) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Shipment 'id', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.Shipment.Model, { exclude: ["id"] });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        await new db_1.Shipment.Model(request.body).save();
        base_1.Endpoint.sendCreated(response);
    }
    async delete(request, response) {
        if (base_1.Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }
        const { id } = request.query;
        if (!id) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }
        const shipment = await db_1.Shipment.Model.findById(id);
        if (!shipment) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }
        await shipment.deleteOne();
        base_1.Endpoint.sendNoContent(response);
    }
}
exports.ShipmentsEndpoint = ShipmentsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpcG1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9zaGlwbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLDhCQUFvRDtBQUNwRCxrQ0FBK0I7QUFFL0IsTUFBYSxpQkFBa0IsU0FBUSxlQUFRO0lBQzNDO1FBQ0ksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFXTSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQXNDLEVBQUUsUUFBMEM7UUFDL0YsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ04sZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztZQUNqRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ1osZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUNyRixPQUFPO1FBQ1gsQ0FBQztRQUVELGVBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLGFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBY00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUF3QyxFQUFFLFFBQTJCO1FBQ25GLElBQUksQ0FBQyxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9FLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxXQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEYsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLHdHQUF3RyxDQUMzRyxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSxzQkFBaUIsRUFBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLGFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLGVBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQWFNLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBc0MsRUFBRSxRQUEyQjtRQUNuRixJQUFJLGVBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDeEQsZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDOUUsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDTixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2pHLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxhQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDWixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsZUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFuR0QsOENBbUdDIn0=