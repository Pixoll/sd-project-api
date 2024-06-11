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
import org.sdproject.api.structures.User;

public class UsersSessionEndpoint extends Endpoint implements Endpoint.PostMethod, Endpoint.DeleteMethod {
    public UsersSessionEndpoint() {
        super("/users/session");
    }

    @MethodDoc(name = "Login as User", description = "Verify user login credentials.")
    @BodyDoc(name = "email", type = String.class, description = "The user's email.")
    @BodyDoc(name = "password", type = String.class, description = "The user's password.")
    @ResponseDoc(name = "session_token", type = String.class, description = "Session token for the logged in user.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully logged in.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Wrong password.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void post(Context ctx) {
        final JSONObject body;
        try {
            body = ctx.bodyAsClass(JSONObject.class);
        } catch (JSONException e) {
            sendError(ctx, HttpStatus.UNPROCESSABLE_CONTENT, "Invalid request body: " + e.getMessage());
            return;
        }

        if (!body.has("email") || !body.has("password")) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected both email and password in the request body.");
            return;
        }

        final String email = body.getString("email");
        final String password = body.getString("password");

        final User user = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.EMAIL.raw, email))
                .first();
        if (user == null) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "User does not exist.");
            return;
        }

        if (!Util.hashPassword(password, user.salt).equals(user.password)) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Wrong password.");
            return;
        }

        ctx.status(HttpStatus.OK).json(new JSONObject().put("session_token",
                SessionTokenManager.generateSessionToken(SessionTokenManager.TokenType.USER, user.rut)
        ));
    }

    @MethodDoc(name = "Logout from User Session", description = "Revoke user session token.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in user. See {endpoint:POST /users/session}."
    )
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully revoked session token.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @Override
    public void delete(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || authData.type() != SessionTokenManager.TokenType.USER) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in.");
            return;
        }

        SessionTokenManager.revokeToken(SessionTokenManager.TokenType.USER, authData.rut());

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
