import { HTTPCode, Methods, sendCreated, sendError } from "./base";
import { Shipment, validateStructure } from "../db";

export const methods = {
    // async get(request, response): Promise<void> {

    // },

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

    // async delete(request, response): Promise<void> {

    // },

    // async patch(request, response): Promise<void> {

    // },
} satisfies Methods;
