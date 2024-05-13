import { HTTPCode, EndpointHandler, sendCreated, sendError, sendNoContent, sendOk, getAuthorizedUser } from "./base";
import { Shipment, validateStructure } from "../db";
import { hasOneOfKeys } from "../util";

export const methods = {
    /**
     * @name Get Shipment
     * @description Returns a {schema:Shipment} for the given tracking `id`.
     * @query id | string | The shipment's tracking id.
     * @response A {schema:Shipment} object.
     * @code 200 Successfully retrieved the shipment.
     * @code 400 Did not provide tracking `id`.
     * @code 404 Shipment with that tracking `id` does not exist.
     */
    async get(request, response): Promise<void> {
        const { id } = request.query;
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
     * @description **Only usable while logged in.**
     * @description Create a new {schema:Shipment}.
     * @body A {schema:Shipment} object without the `id`, `created_timestamp` and `updated_timestamp` fields.
     * @code 201 Successfully created new shipment.
     * @code 400 Malformed shipment structure.
     * @code 401 Not logged in.
     */
    async post(request, response): Promise<void> {
        if (!getAuthorizedUser(request)) {
            sendError(response, HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        if (hasOneOfKeys(request.body, ["id", "created_timestamp", "updated_timestamp"])) {
            sendError(
                response,
                HTTPCode.BadRequest,
                "Shipment 'id', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request."
            );
            return;
        }

        const validationResult = await validateStructure(request.body, Shipment.Model, { exclude: ["id"] });
        if (!validationResult.ok) {
            sendError(response, HTTPCode.BadRequest, validationResult.message);
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
     * @description **Only usable while logged in as an admin.**
     * @description Delete the {schema:Shipment} matching the provided tracking `id`.
     * @header Authorization | string | Session token of the logged in admin. See {endpoint:admins/login}.
     * @query id | string | The shipment's tracking id.
     * @code 204 Successfully deleted the shipment.
     * @code 400 Did not provide tracking `id`.
     * @code 401 Not an admin.
     * @code 404 Shipment with that tracking `id` does not exist.
     */
    async delete(request, response): Promise<void> {
        if (getAuthorizedUser(request)?.type !== "admin") {
            sendError(response, HTTPCode.Unauthorized, "Not an admin.");
            return;
        }

        const { id } = request.query;
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
} satisfies EndpointHandler<{
    get: {
        queryKeys: "id";
        responseData: Shipment.JSON;
    };
    post: {
        body: Shipment.JSON;
    };
    delete: {
        queryKeys: "id";
    };
}>;
