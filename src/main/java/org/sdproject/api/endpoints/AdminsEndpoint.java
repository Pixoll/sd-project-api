package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Admin;

public class AdminsEndpoint extends Endpoint implements Endpoint.GetMethod {
    public AdminsEndpoint() {
        super("/admins");
    }

    @MethodDoc(name = "Get Admin", description = "Returns an {structure:Admin} for the given `rut`.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in admin. See {endpoint:POST /admins/session}."
    )
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the admin.")
    @ResponseDoc("An {structure:Admin} object without the `password` and `salt` fields.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the admin.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Did not provide `rut` or it's malformed.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Admin does not exist.")
    @Override
    public void get(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || authData.type() != SessionTokenManager.TokenType.ADMIN) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not an admin.");
            return;
        }

        final String rut = ctx.queryParam("rut");
        if (rut == null) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected rut in query.");
            return;
        }

        final Admin admin = DatabaseConnection.getAdminsCollection()
                .find(Filters.eq(Admin.Field.RUT.raw, rut))
                .first();
        if (admin == null) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Admin does not exist.");
            return;
        }

        ctx.status(HttpStatus.OK).json(admin);
    }
}
