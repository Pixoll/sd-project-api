package org.sdproject.api.structures;

import org.json.JSONObject;

import javax.annotation.Nonnull;

public interface Structure {
    JSONObject toJSON();

    default void validate() throws ValidationException {
        this.validate("");
    }

    void validate(@Nonnull String parentName) throws ValidationException;

    String toString();
}
