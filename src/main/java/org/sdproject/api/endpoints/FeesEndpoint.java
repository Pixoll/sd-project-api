package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.json.JSONObject;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.MethodDoc;
import org.sdproject.api.documentation.ResponseDoc;
import org.sdproject.api.Util;

public class FeesEndpoint extends Endpoint implements Endpoint.GetMethod {
    public static final JSONObject FEES = Util.readJSONObjectFile("static/fees.json");

    public FeesEndpoint() {
        super("/fees");
    }

    @MethodDoc(name = "Get Fees", description = "Get a list of all applicable fees.")
    @ResponseDoc("Contents of {file:/static/fees.json}.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the fees list.")
    @Override
    public void get(Context ctx) {
        ctx.status(HttpStatus.OK).json(FEES);
    }
}
