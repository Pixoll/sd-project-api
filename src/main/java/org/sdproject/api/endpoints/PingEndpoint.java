package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.MethodDoc;

public class PingEndpoint extends Endpoint implements Endpoint.GetMethod {
    public PingEndpoint() {
        super("/ping");
    }

    @MethodDoc(name = "Send Ping", description = "Check if the API is available.")
    @CodeDoc(code = HttpStatus.OK, reason = "API is available.")
    @Override
    public void get(Context ctx) {
        ctx.status(HttpStatus.OK);
    }
}
