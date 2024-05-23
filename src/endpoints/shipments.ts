import { Endpoint } from "./base";
import { Shipment, validateStructure } from "../db";
import { Util } from "../util";

export class ShipmentsEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    public constructor() {
        super("/shipments");
    }

    /**
     * @name Get Shipment
     * @description Returns a {schema:Shipment} for the given tracking `id`.
     * @query id | string | The shipment's tracking id.
     * @response A {schema:Shipment} object.
     * @code 200 Successfully retrieved the shipment.
     * @code 400 Did not provide tracking `id`.
     * @code 404 Shipment with that tracking `id` does not exist.
     */
    public async get(request: Endpoint.Request<never, "id">, response: Endpoint.Response<Shipment.JSON>): Promise<void> {
        const { id } = request.query;
        if (!id) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }

        const shipment = await Shipment.Model.findById(id);
        if (!shipment) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }

        Endpoint.sendOk(response, Shipment.toJSON(shipment));
    }

    /* eslint-disable max-len */
    /**
     * @name Create Shipment
     * @description **Only usable while logged in.**
     * @description Create a new {schema:Shipment}.
     * @header Authorization | string | Session token of the logged in user or admin. See {endpoint:users/login} and {endpoint:admins/login}.
     * @body A {schema:Shipment} object without the `id`, `created_timestamp` and `updated_timestamp` fields.
     * @code 201 Successfully created new shipment.
     * @code 400 Malformed shipment structure.
     * @code 401 Not logged in.
     */
    /* eslint-enable max-len */
    public async post(request: Endpoint.Request<Shipment.JSON>, response: Endpoint.Response): Promise<void> {
        if (!Endpoint.getAuthorizedUser(request)) {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not logged in.");
            return;
        }

        if (Util.hasOneOfKeys(request.body, ["id", "created_timestamp", "updated_timestamp"])) {
            Endpoint.sendError(
                response,
                Endpoint.HTTPCode.BadRequest,
                "Shipment 'id', 'created_timestamp' and 'updated_timestamp' fields may not be specified in the request."
            );
            return;
        }

        const validationResult = await validateStructure(request.body, Shipment.Model, { exclude: ["id"] });
        if (!validationResult.ok) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, validationResult.message);
            return;
        }

        await new Shipment.Model(request.body).save();
        Endpoint.sendCreated(response);
    }

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
    public async delete(request: Endpoint.Request<never, "id">, response: Endpoint.Response): Promise<void> {
        if (Endpoint.getAuthorizedUser(request)?.type !== "admin") {
            Endpoint.sendError(response, Endpoint.HTTPCode.Unauthorized, "Not an admin.");
            return;
        }

        const { id } = request.query;
        if (!id) {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Expected shipment id in the query.");
            return;
        }

        const shipment = await Shipment.Model.findById(id);
        if (!shipment) {
            Endpoint.sendError(response, Endpoint.HTTPCode.NotFound, "Shipment does not exist.");
            return;
        }

        await shipment.deleteOne();
        Endpoint.sendNoContent(response);
    }
}
