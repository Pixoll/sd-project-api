package org.sdproject.api.structures;

import org.json.JSONObject;

import jakarta.annotation.Nonnull;

public interface UpdatableStructure {
    boolean updateFromJSON(@Nonnull JSONObject json, @Nonnull String parentName) throws ValidationException;

    default boolean updateFromJSON(@Nonnull JSONObject json) throws ValidationException {
        return this.updateFromJSON(json, "");
    }
}
