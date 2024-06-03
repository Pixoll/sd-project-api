package org.sdproject.api.structures;

import org.sdproject.api.json.JSONObject;

public interface Structure {
    JSONObject toJSON();
    void validate() throws ValidationException;
}
