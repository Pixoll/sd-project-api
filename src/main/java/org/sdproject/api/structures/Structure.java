package org.sdproject.api.structures;

import org.json.JSONObject;

public interface Structure {
    JSONObject toJSON();
    void validate() throws ValidationException;
    String toString();
}
