package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.Header;
import io.javalin.http.HttpStatus;
import org.sdproject.api.SessionTokenManager;

import javax.annotation.Nullable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

public abstract class Endpoint {
    public final String path;

    public Endpoint(String path) {
        this.path = path;
    }

    public interface GetMethod {
        void get(Context ctx) throws EndpointException;
    }

    public interface PostMethod {
        void post(Context ctx) throws EndpointException;
    }

    public interface PutMethod {
        void put(Context ctx) throws EndpointException;
    }

    public interface PatchMethod {
        void patch(Context ctx) throws EndpointException;
    }

    public interface DeleteMethod {
        void delete(Context ctx) throws EndpointException;
    }

    public interface AllMethods extends GetMethod, PostMethod, PutMethod, PatchMethod, DeleteMethod {
    }

    public static void beforeMatched(Context ctx) throws EndpointException {
        final String now = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                .replaceAll("T|\\.\\d+$", " ")
                .stripTrailing();

        final HandlerType method = ctx.method();
        System.out.println("[" + now + "] " + method.name() + " " + ctx.matchedPath()
                + "\nbody: " + ctx.body()
                + "\nquery: " + ctx.queryString()
        );

        if (method == HandlerType.POST && !Objects.equals(ctx.header(Header.CONTENT_TYPE), "application/json")) {
            throw new EndpointException(HttpStatus.BAD_REQUEST, "Content-Type header must be 'application/json'.");
        }
    }

    protected static @Nullable AuthorizationData getAuthorizationData(Context ctx) {
        final String token = ctx.header(Header.AUTHORIZATION);
        if (token == null) return null;

        SessionTokenManager.TokenType type = SessionTokenManager.TokenType.USER;
        String rut = SessionTokenManager.getRutFromToken(type, token);

        if (rut == null) {
            type = SessionTokenManager.TokenType.ADMIN;
            rut = SessionTokenManager.getRutFromToken(type, token);
        }

        return rut != null ? new AuthorizationData(type, rut) : null;
    }

    protected record AuthorizationData(SessionTokenManager.TokenType type, String rut) {
        public boolean isAdmin() {
            return this.type == SessionTokenManager.TokenType.ADMIN;
        }

        public boolean isUser() {
            return this.type == SessionTokenManager.TokenType.USER;
        }
    }
}
