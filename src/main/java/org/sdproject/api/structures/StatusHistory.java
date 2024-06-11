package org.sdproject.api.structures;

import org.json.JSONObject;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;

public class StatusHistory implements Structure {
    @FieldDoc(description = "Status of the shipment.")
    public Status status;

    @FieldDoc(description = "Time when the status was recorded/changed to.")
    public Long timestamp;

    public StatusHistory() {
    }

    public StatusHistory(JSONObject json) throws ValidationException {
        this.status = Util.stringToEnum(json.optString(Field.STATUS.name, null), Status.class);
        this.timestamp = json.optLongObject(Field.TIMESTAMP.name, null);

        this.validate();
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.STATUS.name, status.name)
                .put(Field.TIMESTAMP.name, timestamp);
    }

    @Override
    public void validate() throws ValidationException {
        if (this.status == null) {
            throw new ValidationException("Status in shipment history cannot be empty.");
        }

        if (this.timestamp == null) {
            throw new ValidationException("Timestamp in shipment history cannot be empty.");
        }
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
