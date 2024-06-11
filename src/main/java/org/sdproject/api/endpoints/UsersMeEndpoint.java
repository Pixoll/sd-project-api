package org.sdproject.api.endpoints;

import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.User;

public class UsersMeEndpoint extends Endpoint implements Endpoint.GetMethod {
    public UsersMeEndpoint() {
        super("/users/me");
    }

    @MethodDoc(name = "Get Current User", description = "Returns the information of the current logged-in {structure:User}.")
    @HeaderUserAuthDoc
    @ResponseDoc("A {structure:User} object without the `password` and `salt` fields.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the user.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void get(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isUser()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final User user = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, authData.rut()))
                .first();
        if (user == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        ctx.status(HttpStatus.OK).json(user);
    }
}
