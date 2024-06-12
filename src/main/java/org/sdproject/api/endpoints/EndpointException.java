package org.sdproject.api.endpoints;

import io.javalin.http.HttpStatus;
import org.json.JSONObject;

public class EndpointException extends Exception {
    private final HttpStatus statusCode;

    public EndpointException(HttpStatus statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
    }

    public HttpStatus getStatusCode() {
        return this.statusCode;
    }

    public JSONObject toJSON() {
        return new JSONObject()
                .put("message", this.getMessage())
                .put("code", this.statusCode.getCode());
    }
}
