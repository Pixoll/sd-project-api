package org.sdproject.api.structures;

import org.json.JSONObject;

import javax.annotation.Nonnull;

public abstract class Structure {
    public abstract JSONObject toJSON();

    public abstract void validate(@Nonnull String parentName) throws ValidationException;

    public abstract String toString();

    void validate() throws ValidationException {
        this.validate("");
    }

    boolean jsonEquals(@Nonnull Structure other) {
        return other.toJSON().toString().equals(this.toJSON().toString());
    }
}
