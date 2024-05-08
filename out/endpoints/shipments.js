"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const base_1 = require("./base");
const db_1 = require("../db");
exports.methods = {
    async post(request, response) {
        if (request.headers["content-type"] !== "application/json") {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        if (request.body.id) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, "Shipment id may not be specified in the request.");
            return;
        }
        const validationResult = await (0, db_1.validateStructure)(request.body, db_1.Shipment.Model, { exclude: ["id"] });
        if (validationResult !== true) {
            (0, base_1.sendError)(response, base_1.HTTPCode.BadRequest, validationResult);
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpcG1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VuZHBvaW50cy9zaGlwbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1FO0FBQ25FLDhCQUFvRDtBQUV2QyxRQUFBLE9BQU8sR0FBRztJQVluQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQ3hCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSxpREFBaUQsQ0FBQyxDQUFDO1lBQzVGLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUEsZ0JBQVMsRUFBQyxRQUFRLEVBQUUsZUFBUSxDQUFDLFVBQVUsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1lBQzdGLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0JBQWlCLEVBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxhQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BHLElBQUksZ0JBQWdCLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBQSxnQkFBUyxFQUFDLFFBQVEsRUFBRSxlQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0QsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxNQUFNLElBQUksYUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFOUMsSUFBQSxrQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFBLGdCQUFTLEVBQUMsUUFBUSxFQUFFLGVBQVEsQ0FBQyxXQUFXLEVBQUUsc0RBQXNELENBQUMsQ0FBQztRQUN0RyxDQUFDO0lBQ0wsQ0FBQztDQVNjLENBQUMifQ==