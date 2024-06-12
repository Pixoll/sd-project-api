package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.HeaderAdminAuthDoc;
import org.sdproject.api.documentation.MethodDoc;
import org.sdproject.api.documentation.QueryDoc;
import org.sdproject.api.structures.Shipment;

public class ShipmentsCancelEndpoint extends Endpoint implements Endpoint.PatchMethod {
    public ShipmentsCancelEndpoint() {
        super("/shipments/cancel");
    }

    @MethodDoc(
            name = "Mark Shipment as Cancelled",
            description = "Mark the {structure:Shipment} matching the provided tracking `id` as cancelled."
    )
    @HeaderAdminAuthDoc
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully marked the shipment as cancelled.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide tracking `id`.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "Shipment is already marked as cancelled.")
    @Override
    public void patch(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String id = ctx.queryParam("id");
        if (id == null || id.isEmpty()) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected shipment id in the query.");
        }

        final MongoCollection<Shipment> shipmentCollection = DatabaseConnection.getShipmentsCollection();
        final Shipment shipment = shipmentCollection.find(Filters.eq(Shipment.Field.ID.raw, id)).first();
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        if (shipment.cancelled) {
            throw new EndpointException(HttpStatus.CONFLICT, "Shipment is already marked as cancelled.");
        }

        shipment.markAsCancelled();
        shipmentCollection.replaceOne(Filters.eq(Shipment.Field.ID.raw, id), shipment);

        ctx.status(HttpStatus.OK);
    }
}
