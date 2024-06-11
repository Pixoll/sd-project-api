package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONException;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.Util;
import org.sdproject.api.structures.Admin;

public class AdminsSessionEndpoint extends Endpoint implements Endpoint.PostMethod, Endpoint.DeleteMethod {
    public AdminsSessionEndpoint() {
        super("/admins/session");
    }

    @MethodDoc(name = "Login as Admin", description = "Verify admin login credentials.")
    @BodyDoc(name = "email", type = String.class, description = "The admin's email.")
    @BodyDoc(name = "password", type = String.class, description = "The admin's password.")
    @ResponseDoc(name = "session_token", type = String.class, description = "Session token for the logged in admin.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully logged in.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Wrong password.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "Admin does not exist.")
    @Override
    public void post(Context ctx) {
        final JSONObject body;
        try {
            body = ctx.bodyAsClass(JSONObject.class);
        } catch (JSONException e) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Invalid request body: " + e.getMessage());
            return;
        }

        if (!body.has("email") || !body.has("password")) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected both email and password in the request body.");
            return;
        }

        final String email = body.getString("email");
        final String password = body.getString("password");

        final Admin admin = DatabaseConnection.getAdminsCollection()
                .find(Filters.eq(Admin.Field.EMAIL.raw, email))
                .first();
        if (admin == null) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Admin does not exist.");
            return;
        }

        if (!Util.hashPassword(password, admin.salt).equals(admin.password)) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Wrong password.");
            return;
        }

        ctx.status(HttpStatus.OK).json(new JSONObject().put("session_token",
                SessionTokenManager.generateSessionToken(SessionTokenManager.TokenType.ADMIN, admin.rut)
        ));
    }

    @MethodDoc(name = "Logout from Admin Session", description = "Revoke admin session token.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in admin. See {endpoint:POST /admins/session}."
    )
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully revoked session token.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @Override
    public void delete(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in.");
            return;
        if (authData == null || !authData.isAdmin()) {
        }

        SessionTokenManager.revokeToken(SessionTokenManager.TokenType.ADMIN, authData.rut());

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
