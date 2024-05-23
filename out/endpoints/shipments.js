"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsEndpoint = void 0;
const base_1 = require("./base");
const shipment_1 = require("../schemas/shipment");
const validator_1 = require("../schemas/validator");
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
        const shipment = await shipment_1.Shipment.Model.findById(id);
        if (!shipment) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }
        base_1.Endpoint.sendOk(response, shipment_1.Shipment.toJSON(shipment));
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
        const validationResult = await validator_1.StructureValidator.run(request.body, shipment_1.Shipment.Model, { exclude: ["id"] });
        if (!validationResult.ok) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }
        await new shipment_1.Shipment.Model(request.body).save();
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
        const shipment = await shipment_1.Shipment.Model.findById(id);
        if (!shipment) {
            base_1.Endpoint.sendError(response, base_1.Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }
        await shipment.deleteOne();
        base_1.Endpoint.sendNoContent(response);
    }
}
exports.ShipmentsEndpoint = ShipmentsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpcG1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9zaGlwbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBQ2xDLGtEQUErQztBQUMvQyxvREFBMEQ7QUFDMUQsa0NBQStCO0FBRS9CLE1BQWEsaUJBQWtCLFNBQVEsZUFBUTtJQUMzQztRQUNJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBV00sS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFzQyxFQUFFLFFBQTBDO1FBQy9GLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNOLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7WUFDakcsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLG1CQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDWixlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBY00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUF3QyxFQUFFLFFBQTJCO1FBQ25GLElBQUksQ0FBQyxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxlQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9FLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxXQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEYsZUFBUSxDQUFDLFNBQVMsQ0FDZCxRQUFRLEVBQ1IsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQzVCLHdHQUF3RyxDQUMzRyxDQUFDO1lBQ0YsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sOEJBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsbUJBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxJQUFJLG1CQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QyxlQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFhTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQXNDLEVBQUUsUUFBMkI7UUFDbkYsSUFBSSxlQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ3hELGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlFLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ04sZUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztZQUNqRyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNaLGVBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDckYsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixlQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDSjtBQW5HRCw4Q0FtR0MifQ==