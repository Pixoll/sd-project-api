package org.sdproject.api.json;

import org.json.JSONException;

import java.util.Collection;
import java.util.Map;

public class JSONObject extends org.json.JSONObject {
    public JSONObject() {
        super();
    }

    public JSONObject(String source) throws JSONException {
        super(source);
    }

    public JSONObject(org.json.JSONObject source) throws JSONException {
        super(source.toMap());
    }

    @Override
    public JSONObject put(String key, int value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, Map<?, ?> value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, long value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, float value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, double value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, Object value) throws JSONException {
        return (JSONObject) super.put(key, value == null ? NULL : value);
    }

    @Override
    public JSONObject put(String key, boolean value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public JSONObject put(String key, Collection<?> value) throws JSONException {
        return (JSONObject) super.put(key, value);
    }

    @Override
    public <E extends Enum<E>> E optEnum(Class<E> clazz, String key, E defaultValue) {
        final Object value = this.opt(key);
        for (final E e : clazz.getEnumConstants()) {
            if (e.toString().equals(value)) {
                return e;
            }
        }
        return super.optEnum(clazz, key, defaultValue);
    }

    public JSONArray optJSONArray(String key, JSONArray defaultValue) {
        return new JSONArray(super.optJSONArray(key, defaultValue));
    }

    public JSONObject optJSONObject(String key, JSONObject defaultValue) {
        return new JSONObject(super.optJSONObject(key, defaultValue));
    }

    @Override
    public JSONArray getJSONArray(String key) throws JSONException {
        return new JSONArray(super.getJSONArray(key));
    }

    public JSONObject getJSONObject(String key) {
        return new JSONObject(super.getJSONObject(key));
    }
}
