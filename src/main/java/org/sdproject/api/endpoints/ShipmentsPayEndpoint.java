package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.payments.PaymentException;
import org.sdproject.api.payments.PaymentsHandler;
import org.sdproject.api.structures.Shipment;

public class ShipmentsPayEndpoint extends Endpoint implements Endpoint.PostMethod {
    public ShipmentsPayEndpoint() {
        super("/shipments/pay");
    }

    @MethodDoc(name = "Pay a Shipment", description = "**Dummy endpoint**. Pay for a {structure:Shipment} using the user's payment information.")
    @HeaderAdminAuthDoc
    @QueryDoc(key = "id", type = String.class, description = "The shipment's tracking id.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully paid the shipment.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request query or body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Shipment does not exist.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "The shipment was already paid.")
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

        final MongoCollection<Shipment> shipmentsCollection = DatabaseConnection.getShipmentsCollection();
        final Shipment shipment = shipmentsCollection.find(Filters.eq(Shipment.Field.ID.raw, id)).first();
        if (shipment == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "Shipment does not exist.");
        }

        if (shipment.paid) {
            throw new EndpointException(HttpStatus.CONFLICT, "The shipment was already paid.");
        }

        try {
            PaymentsHandler.makePayment();
        } catch (PaymentException e) {
            throw new EndpointException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        shipment.markAsPaid();

        shipmentsCollection.replaceOne(Filters.eq(Shipment.Field.ID.raw, id), shipment);
        ctx.status(HttpStatus.OK);
    }
}
