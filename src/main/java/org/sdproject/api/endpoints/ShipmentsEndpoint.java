package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONException;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.SessionTokenManager;
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
    public void get(Context ctx) {
        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
            return;
        }

        final Shipment shipment = DatabaseConnection.getShipmentsCollection()
                .find(Filters.eq(Shipment.Field.ID.raw, id))
                .first();
        if (shipment == null) {
            sendError(ctx, HttpStatus.NOT_FOUND, "Shipment does not exist.");
            return;
        }

        ctx.status(HttpStatus.OK).json(shipment);
    }

    @MethodDoc(name = "Create Shipment", description = "Create a new {structure:Shipment}.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged-in user or admin. "
                    + "See {endpoint:POST /users/session} and {endpoint:POST /admins/session}."
    )
    @BodyDoc("A {structure:Shipment} object without the `id`, `created_timestamp` and `updated_timestamp` fields.")
    @CodeDoc(code = HttpStatus.CREATED, reason = "Successfully created new shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed shipment structure.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @Override
    public void post(Context ctx) {
        if (getAuthorizationData(ctx) == null) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in.");
            return;
        }

        final JSONObject body;
        try {
            body = ctx.bodyAsClass(JSONObject.class);
        } catch (JSONException e) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Invalid request body: " + e.getMessage());
            return;
        }

        final Shipment newShipment;

        try {
            newShipment = new Shipment(body);
        } catch (ValidationException e) {
            sendError(ctx, HttpStatus.BAD_REQUEST, e.getMessage());
            return;
        }

        DatabaseConnection.getShipmentsCollection().insertOne(newShipment);
        ctx.status(HttpStatus.CREATED).json(new JSONObject()
                .put(Shipment.Field.ID.name, newShipment.id)
        );
    }

    @MethodDoc(name = "Delete Shipment", description = "Delete the {structure:Shipment} matching the provided tracking `id`.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in admin. See {endpoint:POST /admins/session}."
    )
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully deleted the shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide tracking `id`.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @Override
    public void delete(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || authData.type() != SessionTokenManager.TokenType.ADMIN) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
            return;
        }

        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
            return;
        }

        final Shipment shipment = DatabaseConnection.getShipmentsCollection()
                .findOneAndDelete(Filters.eq(Shipment.Field.ID.raw, id));
        if (shipment == null) {
            sendError(ctx, HttpStatus.NOT_FOUND, "Shipment does not exist.");
            return;
        }

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
