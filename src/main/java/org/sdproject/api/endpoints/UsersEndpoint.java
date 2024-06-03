package org.sdproject.api.endpoints;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.*;
import org.sdproject.api.json.JSONObject;
import org.sdproject.api.SessionTokenManager;
import org.sdproject.api.Util;
import org.sdproject.api.structures.User;
import org.sdproject.api.structures.ValidationException;

public class UsersEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    public UsersEndpoint() {
        super("/users");
    }

    @MethodDoc(name = "Get User", description = "Returns a {structure:User} for the given `rut`, `email` or `phone` number.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged in admin. See {endpoint:POST /admins/session}."
    )
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
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not an admin.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void get(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || authData.type() != SessionTokenManager.TokenType.ADMIN) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not an admin.");
            return;
        }

        final String rut = ctx.queryParam("rut");
        final String email = ctx.queryParam("email");
        final Integer phone = ctx.queryParamAsClass("phone", int.class).allowNullable().get();

        if ((rut != null ? 1 : 0) + (email != null ? 1 : 0) + (phone != null ? 1 : 0) != 1) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Expected only one of either rut, email or phone in query.");
            return;
        }

        final User user = DatabaseConnection.getUsersCollection()
                .find(Filters.or(
                        Filters.eq(User.Field.RUT.raw, rut),
                        Filters.eq(User.Field.EMAIL.raw, email),
                        Filters.eq(User.Field.PHONE.raw, phone)
                ))
                .first();
        if (user == null) {
            sendError(ctx, HttpStatus.NOT_FOUND, "User does not exist.");
            return;
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
    public void post(Context ctx) {
        final JSONObject body = ctx.bodyAsClass(JSONObject.class);
        final User newUser = new User(body);

        try {
            newUser.validate();
        } catch (ValidationException e) {
            sendError(ctx, HttpStatus.BAD_REQUEST, e.getMessage());
            return;
        }

        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();
        final User matchingRutUser = usersCollection.find(Filters.eq(User.Field.RUT.raw, newUser.rut())).first();
        if (matchingRutUser != null) {
            sendError(ctx, HttpStatus.CONFLICT, "User with the same RUT already exists.");
            return;
        }

        final User matchingEmailUser = usersCollection.find(Filters.eq(User.Field.EMAIL.raw, newUser.email())).first();
        if (matchingEmailUser != null) {
            sendError(ctx, HttpStatus.CONFLICT, "User with the same email already exists.");
            return;
        }

        final User matchingPhoneUser = usersCollection.find(Filters.eq(User.Field.PHONE.raw, newUser.phone())).first();
        if (matchingPhoneUser != null) {
            sendError(ctx, HttpStatus.CONFLICT, "User with the same phone number already exists.");
            return;
        }

        final String salt = Util.generateSalt();

        body.put(User.Field.PASSWORD.name, Util.hashPassword(newUser.password(), salt))
                .put(User.Field.SALT.name, salt);

        usersCollection.insertOne(new User(body));

        ctx.status(HttpStatus.CREATED);
    }

    @MethodDoc(name = "Delete User", description = "Delete the {structure:User}'s account.")
    @HeaderDoc(
            name = "Authorization",
            type = String.class,
            description = "Session token of the logged-in user. See {endpoint:POST /users/session}."
    )
    @QueryDoc(key = "rut", type = String.class, description = "RUT of the user.")
    @CodeDoc(code = HttpStatus.NO_CONTENT, reason = "Successfully deleted the user.")
    @CodeDoc(code = HttpStatus.UNAUTHORIZED, reason = "Not logged in.")
    @CodeDoc(code = HttpStatus.NOT_FOUND, reason = "User does not exist.")
    @Override
    public void delete(Context ctx) {
        final AuthorizationData authData = getAuthorizationData(ctx);
        if (authData == null || authData.type() != SessionTokenManager.TokenType.USER) {
            sendError(ctx, HttpStatus.UNAUTHORIZED, "Not logged in.");
            return;
        }

        final User user = DatabaseConnection.getUsersCollection()
                .findOneAndDelete(Filters.eq(User.Field.RUT.raw, authData.rut()));
        if (user == null) {
            sendError(ctx, HttpStatus.NOT_FOUND, "User does not exist.");
            return;
        }

        ctx.status(HttpStatus.NO_CONTENT);
    }
}
