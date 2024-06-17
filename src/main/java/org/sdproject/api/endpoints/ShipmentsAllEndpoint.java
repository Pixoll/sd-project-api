package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONArray;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.MethodDoc;
import org.sdproject.api.documentation.ResponseDoc;
import org.sdproject.api.structures.Shipment;

public class ShipmentsAllEndpoint extends Endpoint implements Endpoint.GetMethod {
    public ShipmentsAllEndpoint() {
        super("/shipments/all");
    }

    // TODO: pagination?
    @MethodDoc(name = "Get All Shipment", description = "Returns all the stored {structure:Shipment}s.")
    @ResponseDoc("An array of {structure:Shipment} objects.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the shipments.")
    @Override
    public void get(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final JSONArray shipments = new JSONArray();
        for (final Shipment shipment : DatabaseConnection.getShipmentsCollection().find()) {
            shipments.put(shipment.toJSON());
        }

        ctx.status(HttpStatus.OK).json(shipments);
    }
}
