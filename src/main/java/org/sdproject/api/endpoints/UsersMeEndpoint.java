package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.Shipment;
import org.sdproject.api.structures.User;
import org.sdproject.api.structures.ValidationException;

import java.util.Date;

public class UsersMeEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PatchMethod, Endpoint.DeleteMethod {
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
            SessionTokenManager.revokeToken(authData.type(), authData.rut());
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        ctx.status(HttpStatus.OK).json(user);
    }

    @MethodDoc(name = "Update Current User", description = "Update the information of the current logged-in {structure:User}.")
    @HeaderUserAuthDoc
    @BodyDoc("A partial {structure:User} object with the information to update.")
    @ResponseDoc("The updated {structure:User}, if any information was successfully modified.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully updated.")
    @CodeDoc(code = HttpStatus.NOT_MODIFIED, reason = "Nothing was modified.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed request body.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void patch(Context ctx) throws EndpointException {
        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isUser()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();
        final User user = usersCollection.find(Filters.eq(User.Field.RUT.raw, authData.rut())).first();
        if (user == null) {
            SessionTokenManager.revokeToken(authData.type(), authData.rut());
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        final Date updatedAt = user.updatedAt;

        try {
            user.updateFromJSON(body);
        } catch (ValidationException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        if (updatedAt.compareTo(user.updatedAt) == 0) {
            ctx.status(HttpStatus.NOT_MODIFIED);
            return;
        }

        usersCollection.replaceOne(Filters.eq(User.Field.RUT.raw, user.rut), user);
        ctx.status(HttpStatus.OK).json(user);
    }

    @MethodDoc(name = "Delete Current User", description = "Delete the {structure:User}'s account.")
    @HeaderUserAuthDoc
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the user.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully deleted the user.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "Cannot delete account as it has active shipments associated.")
    @Override
    public void delete(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isUser()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();
        final User user = usersCollection.find(Filters.eq(User.Field.RUT.raw, authData.rut())).first();
        if (user == null) {
            SessionTokenManager.revokeToken(authData.type(), authData.rut());
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        final long activeShipments = DatabaseConnection.getShipmentsCollection().countDocuments(Filters.and(
                Filters.or(
                        Filters.eq(Shipment.Field.SENDER_RUT.raw, authData.rut()),
                        Filters.eq(Shipment.Field.RECIPIENT_RUT.raw, authData.rut())
                ),
                Filters.eq(Shipment.Field.CANCELLED.raw, false),
                Filters.eq(Shipment.Field.COMPLETED.raw, false)
        ));

        if (activeShipments > 0) {
            throw new EndpointException(HttpStatus.CONFLICT, "Cannot delete account as it has active shipments associated.");
        }

        usersCollection.deleteOne(Filters.eq(User.Field.RUT.raw, authData.rut()));
        ctx.status(HttpStatus.NO_CONTENT);
    }
}
