package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Shipment;
import org.sdproject.api.structures.ValidationException;

public class ShipmentsEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    public ShipmentsEndpoint() {
        super("/shipments");
    }

    @MethodDoc(name = "Get Shipment", description = "Returns a {structure:Shipment} for the given tracking `id`.")
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @ResponseDoc("A {structure:Shipment} object.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide tracking `id`.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @Override
    public void get(Context ctx) throws EndpointException {
        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
        }

        final Shipment shipment = DatabaseConnection.getShipmentsCollection()
                .find(Filters.eq(Shipment.Field.ID.raw, id))
                .first();
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        ctx.status(HttpStatus.OK).json(shipment);
    }

    @MethodDoc(name = "Create Shipment", description = "Create a new {structure:Shipment}.")
    @HeaderAnyAuthDoc
    @BodyDoc("A {structure:Shipment} object without the `id`, `created_timestamp` and `updated_timestamp` fields.")
    @CodeDoc(code = HttpStatus.CREATED, reason = "Successfully created new shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed shipment structure.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @Override
    public void post(Context ctx) throws EndpointException {
        if (getAuthorizationData(ctx) == null) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final Shipment newShipment;

        try {
            newShipment = new Shipment(body);
        } catch (ValidationException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        DatabaseConnection.getShipmentsCollection().insertOne(newShipment);
        ctx.status(HttpStatus.CREATED).json(new JSONObject()
                .put(Shipment.Field.ID.name, newShipment.id)
        );
    }

    @MethodDoc(name = "Delete Shipment", description = "Delete the {structure:Shipment} matching the provided tracking `id`.")
    @HeaderAdminAuthDoc
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully deleted the shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide tracking `id`.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @Override
    public void delete(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
        }

        final Shipment shipment = DatabaseConnection.getShipmentsCollection()
                .findOneAndDelete(Filters.eq(Shipment.Field.ID.raw, id));
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
