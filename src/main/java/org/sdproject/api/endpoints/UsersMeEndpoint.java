package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.HeaderDoc;
import org.sdproject.api.documentation.MethodDoc;
import org.sdproject.api.documentation.ResponseDoc;
import org.sdproject.api.structures.User;

public class UsersMeEndpoint extends Endpoint implements Endpoint.GetMethod {
    public UsersMeEndpoint() {
        super("/users/me");
    }

    @MethodDoc(name = "Get Current User", description = "Returns the information of the current logged-in {structure:User}.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged-in user. See {endpoint:POST /users/session}."
    )
    @ResponseDoc("A {structure:User} object without the `password` and `salt` fields.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the user.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void get(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in.");
            return;
        if (authData == null || !authData.isUser()) {
        }

        final User user = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, authData.rut()))
                .first();
        if (user == null) {
            sendError(ctx, HttpStatus.NOT_FOUND, "User does not exist.");
            return;
        }

        ctx.status(HttpStatus.OK).json(user);
    }
}
