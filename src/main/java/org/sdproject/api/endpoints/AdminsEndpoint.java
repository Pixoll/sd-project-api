package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Admin;
import org.sdproject.api.structures.ValidationException;

import java.util.Date;

public class AdminsEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PatchMethod {
    public AdminsEndpoint() {
        super("/admins");
    }

    @MethodDoc(name = "Get Admin", description = "Returns an {structure:Admin} for the given `rut`.")
    @HeaderAdminAuthDoc
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the admin.")
    @ResponseDoc("An {structure:Admin} object without the `password` and `salt` fields.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the admin.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide `rut` or it's malformed.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Admin does not exist.")
    @Override
    public void get(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String rut = ctx.queryParam("rut");
        if (rut == null) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected rut in query.");
        }

        final Admin admin = DatabaseConnection.getAdminsCollection()
                .find(Filters.eq(Admin.Field.RUT.raw, rut))
                .first();
        if (admin == null) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Admin does not exist.");
        }

        ctx.status(HttpStatus.OK).json(admin);
    }

    @MethodDoc(name = "Update Admin", description = "Update the information of the current logged-in {structure:Admin}.")
    @HeaderAdminAuthDoc
    @BodyDoc("A partial {structure:Admin} object with the information to update.")
    @ResponseDoc("The updated {structure:Admin}, if any information was successfully modified.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully updated.")
    @CodeDoc(code = HttpStatus.NOT_MODIFIED, reason = "Nothing was modified.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Admin does not exist.")
    @Override
    public void patch(Context ctx) throws EndpointException {
        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final MongoCollection<Admin> adminsCollection = DatabaseConnection.getAdminsCollection();
        final Admin admin = adminsCollection.find(Filters.eq(Admin.Field.RUT.raw, authData.rut())).first();
        if (admin == null) {
            SessionTokenManager.revokeToken(authData.type(), authData.rut());
            throw new EndpointException(HttpStatus.NOT_FOUND, "Admin does not exist.");
        }

        final boolean updated;

        try {
            updated = admin.updateFromJSON(body);
        } catch (ValidationException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        if (!updated) {
            ctx.status(HttpStatus.NOT_MODIFIED);
            return;
        }

        adminsCollection.replaceOne(Filters.eq(Admin.Field.RUT.raw, admin.rut), admin);
        ctx.status(HttpStatus.OK).json(admin);
    }
}
