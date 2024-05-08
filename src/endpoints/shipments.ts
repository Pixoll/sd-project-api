import { HTTPCode, Methods, sendCreated, sendError, sendNoContent, sendOk } from "./base";
import { Shipment, validateStructure } from "../db";

export const methods = {
    /**
     * @name Get Shipment
     * @description Returns a {schema:Shipment} for the given tracking `id`.
     * @query id -- string -- The shipment's tracking id.
     * @response A {schema:Shipment} object.
     * @code 200 Successfully retrieved the shipment.
     * @code 400 Did not provide tracking `id`.
     * @code 404 Shipment with that tracking `id` does not exist.
     */
    async get(request, response): Promise<void> {
        const { id } = request.query as Partial<Record<string, string>>;
        if (!id) {
            sendError(response, HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }

        try {
            const shipment = await Shipment.Model.findById(id);
            if (!shipment) {
                sendError(response, HTTPCode.NotFound, "Shipment does not exist.");
                return;
            }

            sendOk(response, Shipment.toJSON(shipment));
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to get shipment.");
        }
    },

    /**
     * @name Create Shipment
     * @description Create a new {schema:Shipment}. `id` may not be specified in the request.
     * @body A {schema:Shipment} object without the `id`.
     * @code 201 Successfully created new shipment.
     * @code 400 Malformed shipment structure.
     */
    async post(request, response): Promise<void> {
        if (request.headers["content-type"] !== "application/json") {
            sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }

        if (request.body.id) {
            sendError(response, HTTPCode.BadRequest, "Shipment id may not be specified in the request.");
            return;
        }

        const validationResult = await validateStructure(request.body, Shipment.Model, { exclude: ["id"] });
        if (validationResult !== true) {
            sendError(response, HTTPCode.BadRequest, validationResult);
            return;
        }

        try {
            await new Shipment.Model(request.body).save();

            sendCreated(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to crate new shipment.");
        }
    },

    /**
     * @name Delete Shipment
     * @description Delete the {schema:Shipment} matching the provided tracking `id`.
     * @query id -- string -- The shipment's tracking id.
     * @code 204 Successfully deleted the shipment.
     * @code 400 Did not provide tracking `id`.
     * @code 404 Shipment with that tracking `id` does not exist.
     */
    async delete(request, response): Promise<void> {
        const { id } = request.query as Partial<Record<string, string>>;
        if (!id) {
            sendError(response, HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }

        try {
            const shipment = await Shipment.Model.findById(id);
            if (!shipment) {
                sendError(response, HTTPCode.NotFound, "Shipment does not exist.");
                return;
            }

            await shipment.deleteOne();
            sendNoContent(response);
        } catch (error) {
            console.error(error);
            sendError(response, HTTPCode.ServerError, "Unexpected error while trying to get shipment.");
        }
    },

    // async patch(request, response): Promise<void> {

    // },
} satisfies Methods;
