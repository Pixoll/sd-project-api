package org.sdproject.api.structures;

import org.json.JSONObject;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;

import javax.annotation.Nonnull;

public class StatusHistory implements Structure {
    @FieldDoc(description = "Status of the shipment.")
    public Status status;

    @FieldDoc(description = "Time when the status was recorded/changed to.")
    public Long timestamp;

    public StatusHistory() {
    }

    public StatusHistory(JSONObject json, @Nonnull String parentName) throws ValidationException {
        this.status = Util.stringToEnum(json.optString(Field.STATUS.name, null), Status.class);
        this.timestamp = json.optLongObject(Field.TIMESTAMP.name, null);

        this.validate(parentName);
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.STATUS.name, status.name)
                .put(Field.TIMESTAMP.name, timestamp);
    }

    @Override
    public void validate(@Nonnull String parentName) throws ValidationException {
        final String keyPrefix = parentName.isEmpty() ? "" : parentName + ".";

        if (this.status == null) {
            throw new ValidationException(keyPrefix + Field.STATUS.name, "Status in shipment history cannot be empty.");
        }

        if (this.timestamp == null) {
            throw new ValidationException(
                    keyPrefix + Field.TIMESTAMP.name,
                    "Timestamp in shipment history cannot be empty."
            );
        }
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + " " + this.toJSON().toString(2);
    }

    public enum Field {
        STATUS("status"),
        TIMESTAMP("timestamp");

        public final String name;

        Field(String name) {
            this.name = name;
        }
    }

    public enum Status {
        PENDING("pending"),
        PRE_TRANSIT("pre-transit"),
        IN_TRANSIT("in_transit"),
        OUT_FOR_DELIVERY("out_for_delivery"),
        DELIVERED("delivered");

        public final String name;

        Status(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return this.name;
        }
    }
}
