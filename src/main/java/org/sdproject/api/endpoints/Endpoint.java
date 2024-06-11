package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.Header;
import io.javalin.http.HttpStatus;
import org.jetbrains.annotations.Nullable;
import org.json.JSONObject;
import org.sdproject.api.SessionTokenManager;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

public abstract class Endpoint {
    public final String path;

    public Endpoint(String path) {
        this.path = path;
    }

    public interface GetMethod {
        void get(Context ctx);
    }

    public interface PostMethod {
        void post(Context ctx);
    }

    public interface PutMethod {
        void put(Context ctx);
    }

    public interface PatchMethod {
        void patch(Context ctx);
    }

    public interface DeleteMethod {
        void delete(Context ctx);
    }

    public interface AllMethods extends GetMethod, PostMethod, PutMethod, PatchMethod, DeleteMethod {
    }

    public static void beforeMatched(Context ctx) {
        final String now = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                .replaceAll("T|\\.\\d+$", " ")
                .stripTrailing();

        final HandlerType method = ctx.method();
        System.out.println("[" + now + "] " + method.name() + " " + ctx.matchedPath()
                + "\nbody: " + ctx.body()
                + "\nquery: " + ctx.queryString()
        );

        if (method == HandlerType.POST && !Objects.equals(ctx.header(Header.CONTENT_TYPE), "application/json")) {
            sendError(ctx, HttpStatus.BAD_REQUEST, "Content-Type header must be 'application/json'.");
        }
    }

    protected static void sendError(Context ctx, HttpStatus code, String message) {
        final JSONObject obj = new JSONObject();
        obj.put("status", code.getCode());
        obj.put("message", message);
        ctx.status(code).json(obj);
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
    }
}
