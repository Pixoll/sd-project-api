package org.sdproject.api;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder;
import org.sdproject.api.endpoints.*;

public class Api {
    public static final Dotenv DOTENV = Dotenv.load();

    public static void main(String[] args) {
        SessionTokenManager.loadSessionTokens();
        DatabaseConnection.create();

        Javalin.create(config -> {
                    config.router.contextPath = "/api/v1";
                    config.router.ignoreTrailingSlashes = true;
                    config.router.apiBuilder(() -> registerEndpoints(
                            new AdminsEndpoint(),
                            new AdminsSessionEndpoint(),
                            new FeesEndpoint(),
                            new PingEndpoint(),
                            new RegionsEndpoint(),
                            new ShipmentsEndpoint(),
                            new UsersEndpoint(),
                            new UsersMeEndpoint(),
                            new UsersSessionEndpoint(),
                            new UsersVerifyIdEndpoint()
                    ));
                    config.jsonMapper(new JSONMapper());
                })
                .beforeMatched(Endpoint::beforeMatched)
                .start(Integer.parseInt(DOTENV.get("PORT")));
    }

    private static void registerEndpoints(Endpoint... endpoints) {
        for (final Endpoint endpoint : endpoints) {
            ApiBuilder.path(endpoint.path, () -> {
                if (endpoint instanceof Endpoint.GetMethod method) {
                    ApiBuilder.get(method::get);
                }
                if (endpoint instanceof Endpoint.PostMethod method) {
                    ApiBuilder.post(method::post);
                }
                if (endpoint instanceof Endpoint.PutMethod method) {
                    ApiBuilder.put(method::put);
                }
                if (endpoint instanceof Endpoint.PatchMethod method) {
                    ApiBuilder.patch(method::patch);
                }
                if (endpoint instanceof Endpoint.DeleteMethod method) {
                    ApiBuilder.delete(method::delete);
                }
            });
        }
    }
}
