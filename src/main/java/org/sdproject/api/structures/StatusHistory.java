package org.sdproject.api.structures;

import org.json.JSONObject;
import org.sdproject.api.documentation.FieldDoc;

import jakarta.annotation.Nonnull;
import java.util.Date;

public class StatusHistory extends Structure {
    @FieldDoc(description = "Status of the shipment.")
    public Status status;

    @FieldDoc(description = "Time when the status was recorded/changed to.")
    public Long timestamp;

    public StatusHistory() {
    }

    public StatusHistory(Status status) {
        this.status = status;
        this.timestamp = new Date().getTime();
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.STATUS.name, status.name)
                .put(Field.TIMESTAMP.name, timestamp);
    }

    @Override
    public void validate(@Nonnull String parentName) {
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
