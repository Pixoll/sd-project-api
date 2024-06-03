package org.sdproject.api.json;

import io.javalin.json.JsonMapper;
import org.jetbrains.annotations.NotNull;
import org.sdproject.api.structures.Structure;

import java.lang.reflect.Type;

public class JSONMapper implements JsonMapper {
    @NotNull
    @Override
    public String toJsonString(@NotNull Object obj, @NotNull Type type) {
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
    @NotNull
    @Override
    public <T> T fromJsonString(@NotNull String json, @NotNull Type targetType) {
        return (T) new JSONObject(json.startsWith("{") ? json : "{}");
    }
}
