package org.sdproject.api.endpoints;

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import org.sdproject.api.documentation.CodeDoc;
import org.sdproject.api.documentation.MethodDoc;
import org.sdproject.api.documentation.ResponseDoc;
import org.sdproject.api.json.JSONObject;
import org.sdproject.api.Util;

import java.util.ArrayList;

public class RegionsEndpoint extends Endpoint implements Endpoint.GetMethod {
    public static final ArrayList<JSONObject> REGIONS = Util.readJSONArrayFile("static/regions_communes.json");

    public RegionsEndpoint() {
        super("/regions");
    }

    @MethodDoc(name = "Get Regions", description = "Get a list of all regions in the country alongside all their communes.")
    @ResponseDoc("Contents of {file:/static/regions_communes.json}.")
    @CodeDoc(code = HttpStatus.OK, reason = "Successfully retrieved the regions list.")
    @Override
    public void get(Context ctx) {
        ctx.status(HttpStatus.OK).json(REGIONS);
    }
}
