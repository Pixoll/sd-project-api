package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Shipment;
import org.sdproject.api.structures.StatusHistory;

public class ShipmentsStatusEndpoint extends Endpoint implements Endpoint.PostMethod {
    public ShipmentsStatusEndpoint() {
        super("/shipments/status");
    }

    @MethodDoc(name = "Update Shipment Status", description = "Update the specified {structure:Shipment}'s status. "
            + "Must follow the same order provided by {structure:StatusHistory}."
    )
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in admin. See {endpoint:POST /admins/session}."
    )
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @BodyDoc(
            name = "new_status",
            type = String.class,
            description = "The shipment's new status. See {structure:StatusHistory}."
    )
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully updated the shipment's status.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request query or body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "New status does not follow the order provided by {structure:StatusHistory}.")
    @Override
    public void post(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
        }

        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final String statusString = body.optString("new_status");
        if (statusString == null || statusString.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected new shipment status in the request body.");
        }

        final StatusHistory.Status newStatus = Util.stringToEnum(statusString, StatusHistory.Status.class);
        if (newStatus == null) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Invalid new status in the request body.");
        }

        final MongoCollection<Shipment> shipmentsCollection = DatabaseConnection.getShipmentsCollection();
        final Shipment shipment = shipmentsCollection.find(Filters.eq(Shipment.Field.ID.raw, id)).first();
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        if (!shipment.updateStatus(newStatus)) {
            throw new EndpointException(HttpStatus.CONFLICT, "Shipment status cannot be set to " + newStatus
                    + " as it's currently set to " + shipment.currentStatus() + "."
            );
        }

        shipmentsCollection.replaceOne(Filters.eq(Shipment.Field.ID.raw, id), shipment);
        ctx.status(HttpStatus.OK);
    }
}
