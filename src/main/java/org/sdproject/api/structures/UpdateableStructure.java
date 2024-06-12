package org.sdproject.api.structures;

import org.json.JSONObject;

import javax.annotation.Nonnull;

public interface UpdateableStructure {
    void updateFromJSON(@Nonnull JSONObject json, @Nonnull String parentName) throws ValidationException;

    default void updateFromJSON(@Nonnull JSONObject json) throws ValidationException {
        this.updateFromJSON(json, "");
    }
}
