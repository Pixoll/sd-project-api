package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Shipment;
import org.sdproject.api.structures.ValidationException;

import java.util.Date;

public class ShipmentsEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.PatchMethod {
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

    @MethodDoc(
            name = "Update Shipment",
            description = "Update the information of a {structure:Shipment} by its tracking `id`."
    )
    @HeaderAdminAuthDoc
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @BodyDoc("A partial {structure:Shipment} object with the information to update.")
    @ResponseDoc("The updated {structure:Shipment}, if any information was successfully modified.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully updated.")
    @CodeDoc(code = HttpStatus.NOT_MODIFIED, reason = "Nothing was modified.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @Override
    public void patch(Context ctx) throws EndpointException {
        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
        }

        final MongoCollection<Shipment> shipmentsCollection = DatabaseConnection.getShipmentsCollection();
        final Shipment shipment = shipmentsCollection.find(Filters.eq(Shipment.Field.ID.raw, id)).first();
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        final Date updatedAt = shipment.updatedAt;

        try {
            shipment.updateFromJSON(body);
        } catch (ValidationException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        if (updatedAt.compareTo(shipment.updatedAt) == 0) {
            ctx.status(HttpStatus.NOT_MODIFIED);
            return;
        }

        shipmentsCollection.replaceOne(Filters.eq(Shipment.Field.ID.raw, id), shipment);
        ctx.status(HttpStatus.OK).json(shipment);
    }
}
