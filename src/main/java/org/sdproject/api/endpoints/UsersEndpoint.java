package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.*;
import org.sdproject.api.structures.User;
import org.sdproject.api.structures.ValidationException;

import java.util.Date;

public class UsersEndpoint
        extends Endpoint
        implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.PatchMethod, Endpoint.DeleteMethod {
    public UsersEndpoint() {
        super("/users");
    }

    @MethodDoc(name = "Get User", description = "Returns a {structure:User} for the given `rut`, `email` or `phone` number.")
    @HeaderAdminAuthDoc
    @QueryDoc(
            key = "rut",
            type = String.class,
            description = "RUT of the user. `email` and `phone` cannot be present if this parameter is."
    )
    @QueryDoc(
            key = "email",
            type = String.class,
            description = "Email of the user. `rut` and `phone` cannot be present if this parameter is."
    )
    @QueryDoc(
            key = "phone",
            type = String.class,
            description = "Phone number of the user. `rut` and `email` cannot be present if this parameter is."
    )
    @ResponseDoc("A {structure:User} object without the `password` and `salt` fields.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the user.")
    @CodeDoc(
            code = HttpStatus.BAD_REQUEST,
            reason = "Provided none or more than one kind of parameter, or the parameter is malformed."
    )
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in as an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void get(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isAdmin()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in as an admin.");
        }

        final String rut = ctx.queryParam("rut");
        final String email = ctx.queryParam("email");
        final Integer phone = ctx.queryParamAsClass("phone", int.class).allowNullable().get();

        if ((rut != null ? 1 : 0) + (email != null ? 1 : 0) + (phone != null ? 1 : 0) != 1) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Expected only one of either rut, email or phone in query.");
        }

        final User user = DatabaseConnection.getUsersCollection()
                .find(Filters.or(
                        Filters.eq(User.Field.RUT.raw, rut),
                        Filters.eq(User.Field.EMAIL.raw, email),
                        Filters.eq(User.Field.PHONE.raw, phone)
                ))
                .first();
        if (user == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        ctx.status(HttpStatus.OK).json(user);
    }

    @MethodDoc(
            name = "Create User",
            description = "Create a new {structure:User}. Only one user per `rut`, `email` or `phone` number may exist at one time."
    )
    @BodyDoc("A {structure:User} object without the `salt`, `verified`, `created_timestamp` and `updated_timestamp` fields.")
    @CodeDoc(code = HttpStatus.CREATED, reason = "Successfully created new user.")
    @CodeDoc(code = HttpStatus.BAD_REQUEST, reason = "Malformed user structure.")
    @CodeDoc(code = HttpStatus.CONFLICT, reason = "A user with that `rut`, `email` or `phone` number already exists.")
    @Override
    public void post(Context ctx) throws EndpointException {
        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final User newUser;

        try {
            newUser = new User(body);
        } catch (ValidationException e) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();
        final User matchingRutUser = usersCollection.find(Filters.eq(User.Field.RUT.raw, newUser.rut)).first();
        if (matchingRutUser != null) {
            throw new EndpointException(HttpStatus.CONFLICT, "User with the same RUT already exists.");
        }

        final User matchingEmailUser = usersCollection.find(Filters.eq(User.Field.EMAIL.raw, newUser.email)).first();
        if (matchingEmailUser != null) {
            throw new EndpointException(HttpStatus.CONFLICT, "User with the same email already exists.");
        }

        final User matchingPhoneUser = usersCollection.find(Filters.eq(User.Field.PHONE.raw, newUser.phone)).first();
        if (matchingPhoneUser != null) {
            throw new EndpointException(HttpStatus.CONFLICT, "User with the same phone number already exists.");
        }

        final String salt = Util.generateSalt();
        newUser.password = Util.hashPassword(newUser.password, salt);
        newUser.salt = salt;

        usersCollection.insertOne(newUser);

        ctx.status(HttpStatus.CREATED);
    }

    @MethodDoc(name = "Update User", description = "Update the information of the current logged-in {structure:User}.")
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

    @MethodDoc(name = "Delete User", description = "Delete the {structure:User}'s account.")
    @HeaderUserAuthDoc
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the user.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully deleted the user.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void delete(Context ctx) throws EndpointException {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || !authData.isUser()) {
            throw new EndpointException(HttpStatus.UNAUTHORIZED, "Not logged in.");
        }

        final User user = DatabaseConnection.getUsersCollection()
                .findOneAndDelete(Filters.eq(User.Field.RUT.raw, authData.rut()));
        if (user == null) {
            throw new EndpointException(HttpStatus.NOT_FOUND, "User does not exist.");
        }

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
