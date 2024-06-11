package org.sdproject.api;

import io.javalin.http.HttpStatus;
import io.javalin.json.JsonMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.sdproject.api.endpoints.EndpointException;
import org.sdproject.api.structures.Structure;

import javax.annotation.Nonnull;
import java.lang.reflect.Type;

public class JSONMapper implements JsonMapper {
    @Nonnull
    @Override
    public String toJsonString(@Nonnull Object obj, @Nonnull Type type) {
        if (obj instanceof JSONObject json) {
            return json.toString();
        }
        if (obj instanceof JSONArray array) {
            return array.toString();
        }
        if (obj instanceof Structure structure) {
            return structure.toJSON().toString();
        }
        return obj.toString();
    }

    @SuppressWarnings("unchecked")
    @Nonnull
    @Override
    public <T> T fromJsonString(@Nonnull String json, @Nonnull Type targetType) {
        try {
            return (T) new JSONObject(json);
        } catch (JSONException e) {
            throw new RuntimeException(
                    new EndpointException(HttpStatus.BAD_REQUEST, "Invalid request body: " + e.getMessage())
            );
        }
    }
}
