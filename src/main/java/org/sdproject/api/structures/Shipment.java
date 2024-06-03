package org.sdproject.api.structures;

import com.mongodb.client.model.Filters;
import org.bson.BsonType;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.codecs.pojo.annotations.BsonRepresentation;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.Nullable;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONArray;
import org.sdproject.api.json.JSONObject;

import java.util.*;

public record Shipment(
        @BsonId() @BsonRepresentation(BsonType.STRING)
        @FieldDoc(description = "The shipment id. Used for tracking.")
        @Nullable String id,
        @BsonProperty("rut_sender")
        @FieldDoc(jsonKey = "rut_sender", description = "RUT of the sender. Must be of an existing {structure:User}.")
        @Nullable String rutSender,
        @BsonProperty("rut_recipient")
        @FieldDoc(jsonKey = "rut_recipient", description = "RUT of the recipient. Must be of an existing {structure:User}.")
        @Nullable String rutRecipient,
        @BsonProperty("source_address")
        @FieldDoc(jsonKey = "source_address", description = "Address where the packages are being shipped from.")
        @Nullable Address sourceAddress,
        @BsonProperty("destination_address")
        @FieldDoc(jsonKey = "destination_address", description = "Address where the packages are being shipped to.")
        @Nullable Address destinationAddress,
        @BsonProperty("dispatch_timestamp")
        @FieldDoc(jsonKey = "dispatch_timestamp", description = "When the shipment was picked up from the source address.")
        @Nullable Long dispatchTimestamp,
        @BsonProperty("delivery_timestamp")
        @FieldDoc(jsonKey = "delivery_timestamp", description = "When the shipment arrived to the destination address.")
        @Nullable Long deliveryTimestamp,
        @FieldDoc(description = "Status of the shipment.")
        @Nullable Status status,
        @BsonProperty("shipping_type")
        @FieldDoc(jsonKey = "shipping_type", description = "Type of the shipping.")
        @Nullable Type shippingType,
        @BsonProperty("pending_payment")
        @FieldDoc(jsonKey = "pending_payment", description = "Whether the shipment is going to be paid by the recipient or not.")
        @Nullable Boolean pendingPayment,
        @BsonProperty("home_pickup")
        @FieldDoc(jsonKey = "home_pickup", description = "Whether the packages are being picked up at the sender's address.")
        @Nullable Boolean homePickup,
        @BsonProperty("home_delivery")
        @FieldDoc(jsonKey = "home_delivery", description = "Whether the packages are being shipped to the recipient's address.")
        @Nullable Boolean homeDelivery,
        @FieldDoc(description = "All the packages being shipped.")
        @Nullable List<Package> packages,
        @FieldDoc(isCreatedTimestamp = true)
        @Nullable Date createdAt,
        @FieldDoc(isUpdatedTimestamp = true)
        @Nullable Date updatedAt
) implements Structure {
    public Shipment(JSONObject requestBody) {
        this(
                new ObjectId().toHexString(),
                requestBody.optString(Field.RUT_SENDER.name, null),
                requestBody.optString(Field.RUT_RECIPIENT.name, null),
                new Address(requestBody.optJSONObject(Field.SOURCE_ADDRESS.name, new JSONObject())),
                new Address(requestBody.optJSONObject(Field.DESTINATION_ADDRESS.name, new JSONObject())),
                requestBody.optLongObject(Field.DISPATCH_TIMESTAMP.name, null),
                requestBody.optLongObject(Field.DELIVERY_TIMESTAMP.name, null),
                requestBody.optEnum(Status.class, Field.STATUS.name, null),
                requestBody.optEnum(Type.class, Field.SHIPPING_TYPE.name, null),
                requestBody.optBooleanObject(Field.PENDING_PAYMENT.name, null),
                requestBody.optBooleanObject(Field.HOME_PICKUP.name, null),
                requestBody.optBooleanObject(Field.HOME_DELIVERY.name, null),
                requestBody.optJSONArray(Field.PACKAGES.name, new JSONArray()).toList(JSONObject.class)
                        .stream()
                        .map(Package::new)
                        .toList(),
                new Date(),
                new Date()
        );
    }

    public enum Field {
        ID("id", "_id"),
        RUT_SENDER("rut_sender"),
        RUT_RECIPIENT("rut_recipient"),
        SOURCE_ADDRESS("source_address"),
        DESTINATION_ADDRESS("destination_address"),
        DISPATCH_TIMESTAMP("dispatch_timestamp"),
        DELIVERY_TIMESTAMP("delivery_timestamp"),
        STATUS("status"),
        SHIPPING_TYPE("shipping_type"),
        PENDING_PAYMENT("pending_payment"),
        HOME_PICKUP("home_pickup"),
        HOME_DELIVERY("home_delivery"),
        PACKAGES("packages"),
        CREATED_TIMESTAMP("created_timestamp", "createdAt"),
        UPDATED_TIMESTAMP("updated_timestamp", "updatedAt");

        public final String name;
        public final String raw;

        Field(String name, String raw) {
            this.name = name;
            this.raw = raw;
        }

        Field(String name) {
            this(name, name);
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

    public enum Type {
        SAME_DAY("same_day"),
        FAST("fast"),
        REGULAR("regular");

        public final String name;

        Type(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return this.name;
        }
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.ID.name, this.id)
                .put(Field.RUT_SENDER.name, this.rutSender)
                .put(Field.RUT_RECIPIENT.name, this.rutRecipient)
                .put(Field.SOURCE_ADDRESS.name, this.sourceAddress != null ? this.sourceAddress.toJSON() : null)
                .put(Field.DESTINATION_ADDRESS.name, this.destinationAddress != null ? this.destinationAddress.toJSON() : null)
                .put(Field.DISPATCH_TIMESTAMP.name, this.dispatchTimestamp)
                .put(Field.DELIVERY_TIMESTAMP.name, this.deliveryTimestamp)
                .put(Field.STATUS.name, this.status != null ? this.status.name : null)
                .put(Field.SHIPPING_TYPE.name, this.shippingType != null ? this.shippingType.name : null)
                .put(Field.PENDING_PAYMENT.name, this.pendingPayment)
                .put(Field.HOME_PICKUP.name, this.homePickup)
                .put(Field.HOME_DELIVERY.name, this.homeDelivery)
                .put(Field.PACKAGES.name, this.packages != null
                        ? new JSONArray(this.packages.stream().map(Package::toJSON).toList())
                        : null)
                .put(Field.CREATED_TIMESTAMP.name, this.createdAt != null ? this.createdAt.getTime() : null)
                .put(Field.UPDATED_TIMESTAMP.name, this.updatedAt != null ? this.updatedAt.getTime() : null);
    }

    @Override
    public void validate() throws ValidationException {
        if (this.rutSender == null) {
            throw new ValidationException("Sender rut cannot be empty.");
        }

        if (Objects.equals(this.rutSender, this.rutRecipient)) {
            throw new ValidationException("Sender and recipient cannot be the same.");
        }

        User.validateRut(this.rutSender);

        final User sender = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, this.rutSender))
                .first();
        if (sender == null) {
            throw new ValidationException("User with rut " + this.rutSender + " does not exist.");
        }

        if (this.rutRecipient == null) {
            throw new ValidationException("Recipient rut cannot be empty.");
        }

        User.validateRut(this.rutRecipient);

        final User recipient = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, this.rutRecipient))
                .first();
        if (recipient == null) {
            throw new ValidationException("User with rut " + this.rutRecipient + " does not exist.");
        }

        if (this.sourceAddress == null) {
            throw new ValidationException("Source address cannot be empty.");
        }

        this.sourceAddress.validate();

        if (this.destinationAddress == null) {
            throw new ValidationException("Destination address cannot be empty.");
        }

        this.destinationAddress.validate();

        if (this.status == null) {
            throw new ValidationException("Shipment status cannot be empty.");
        }

        if (this.shippingType == null) {
            throw new ValidationException("Shipping type cannot be empty.");
        }

        if (this.pendingPayment == null) {
            throw new ValidationException("Pending payment cannot be empty.");
        }

        if (this.homePickup == null) {
            throw new ValidationException("Home pickup cannot be empty.");
        }

        if (this.homeDelivery == null) {
            throw new ValidationException("Home delivery cannot be empty.");
        }

        if (this.packages == null || this.packages.isEmpty()) {
            throw new ValidationException("Packages cannot be empty.");
        }

        for (final Package pkg : this.packages) {
            pkg.validate();
        }
    }
}
