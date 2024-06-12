package org.sdproject.api.structures;

import com.mongodb.client.model.Filters;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.*;

public class Shipment extends Structure implements UpdatableStructure {
    @BsonId
    @FieldDoc(description = "The shipment id. Used for tracking.", readonly = true, generated = true)
    public String id;

    @BsonProperty("sender_rut")
    @FieldDoc(
            jsonKey = "sender_rut",
            description = "RUT of the sender. Must be of an existing {structure:User}.",
            readonly = true
    )
    public String senderRut;

    @BsonProperty("recipient_rut")
    @FieldDoc(jsonKey = "recipient_rut", description = "RUT of the recipient. Must be of an existing {structure:User}.")
    public String recipientRut;

    @BsonProperty("source_address")
    @FieldDoc(
            jsonKey = "source_address",
            description = "Address where the packages are being shipped from.",
            readonly = true
    )
    public Address sourceAddress;

    @BsonProperty("destination_address")
    @FieldDoc(
            jsonKey = "destination_address",
            description = "Address where the packages are being shipped to.",
            readonly = true
    )
    public Address destinationAddress;

    @BsonProperty("dispatch_timestamp")
    @FieldDoc(
            jsonKey = "dispatch_timestamp",
            description = "When the shipment was picked up from the source address.",
            readonly = true,
            generated = true
    )
    public @Nullable Long dispatchTimestamp;

    @BsonProperty("delivery_timestamp")
    @FieldDoc(
            jsonKey = "delivery_timestamp",
            description = "When the shipment arrived to the destination address.",
            readonly = true,
            generated = true
    )
    public @Nullable Long deliveryTimestamp;

    @BsonProperty("status_history")
    @FieldDoc(
            jsonKey = "status_history",
            description = "Status history of the shipment.",
            readonly = true,
            generated = true
    )
    public ArrayList<StatusHistory> statusHistory;

    @BsonProperty("shipping_type")
    @FieldDoc(jsonKey = "shipping_type", description = "Type of the shipping.", readonly = true)
    public Type shippingType;

    @BsonProperty("pending_payment")
    @FieldDoc(
            jsonKey = "pending_payment",
            description = "Whether the shipment is going to be paid by the recipient or not.",
            readonly = true
    )
    public Boolean pendingPayment;

    @BsonProperty("home_pickup")
    @FieldDoc(
            jsonKey = "home_pickup",
            description = "Whether the packages are being picked up at the sender's address.",
            readonly = true
    )
    public Boolean homePickup;

    @BsonProperty("home_delivery")
    @FieldDoc(
            jsonKey = "home_delivery",
            description = "Whether the packages are being shipped to the recipient's address.",
            readonly = true
    )
    public Boolean homeDelivery;

    @FieldDoc(description = "All the packages being shipped.", readonly = true)
    public ArrayList<Package> packages;

    @FieldDoc(description = "Whether this shipment was cancelled.", readonly = true, generated = true)
    public boolean cancelled;

    @BsonProperty("created_at")
    @FieldDoc(isCreatedTimestamp = true)
    public Date createdAt;

    @BsonProperty("updated_at")
    @FieldDoc(isUpdatedTimestamp = true)
    public Date updatedAt;

    public Shipment() {
    }

    public Shipment(JSONObject json) throws ValidationException {
        this.id = new ObjectId().toHexString();
        this.senderRut = json.optString(Field.SENDER_RUT.name, null);
        this.recipientRut = json.optString(Field.RECIPIENT_RUT.name, null);
        this.sourceAddress = json.has(Field.SOURCE_ADDRESS.name) ? new Address(
                json.optJSONObject(Field.SOURCE_ADDRESS.name, new JSONObject()),
                Field.SOURCE_ADDRESS.name
        ) : null;
        this.destinationAddress = json.has(Field.DESTINATION_ADDRESS.name) ? new Address(
                json.optJSONObject(Field.DESTINATION_ADDRESS.name, new JSONObject()),
                Field.DESTINATION_ADDRESS.name
        ) : null;
        this.dispatchTimestamp = null;
        this.deliveryTimestamp = null;

        this.statusHistory = new ArrayList<>();
        this.statusHistory.add(new StatusHistory(StatusHistory.Status.PENDING));

        this.shippingType = Util.stringToEnum(json.optString(Field.SHIPPING_TYPE.name, null), Type.class);
        this.pendingPayment = json.optBooleanObject(Field.PENDING_PAYMENT.name, null);
        this.homePickup = json.optBooleanObject(Field.HOME_PICKUP.name, null);
        this.homeDelivery = json.optBooleanObject(Field.HOME_DELIVERY.name, null);

        this.packages = new ArrayList<>();
        final List<JSONObject> jsonPackages = Util.jsonArrayToList(
                json.optJSONArray(Field.PACKAGES.name, new JSONArray()),
                JSONObject.class
        );

        for (int i = 0; i < jsonPackages.size(); i++) {
            final JSONObject jsonPackage = jsonPackages.get(i);
            this.packages.add(new Package(jsonPackage, Field.PACKAGES.name + "[" + i + "]"));
        }

        this.cancelled = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.validate();
    }

    public StatusHistory.Status currentStatus() {
        this.statusHistory.sort((sh1, sh2) -> Math.toIntExact(sh1.timestamp - sh2.timestamp));
        return this.statusHistory.get(this.statusHistory.size() - 1).status;
    }

    public boolean updateStatus(StatusHistory.Status status) {
        //noinspection ComparatorResultComparison
        if (status.compareTo(this.currentStatus()) != 1) return false;
        return this.statusHistory.add(new StatusHistory(status));
    }

    @Override
    public void updateFromJSON(@NotNull JSONObject json, @NotNull String parentName) throws ValidationException {
        final Shipment original = (Shipment) this.clone();

        this.recipientRut = json.optString(Field.RECIPIENT_RUT.name, this.recipientRut);

        this.validate();

        if (!this.jsonEquals(original)) {
            this.updatedAt = new Date();
        }
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.ID.name, this.id)
                .put(Field.SENDER_RUT.name, this.senderRut)
                .put(Field.RECIPIENT_RUT.name, this.recipientRut)
                .put(Field.SOURCE_ADDRESS.name, this.sourceAddress.toJSON())
                .put(Field.DESTINATION_ADDRESS.name, this.destinationAddress.toJSON())
                .put(Field.DISPATCH_TIMESTAMP.name, this.dispatchTimestamp)
                .put(Field.DELIVERY_TIMESTAMP.name, this.deliveryTimestamp)
                .put(Field.STATUS_HISTORY.name, new JSONArray(
                        this.statusHistory.stream().map(StatusHistory::toJSON).toList()
                ))
                .put(Field.SHIPPING_TYPE.name, this.shippingType.name)
                .put(Field.PENDING_PAYMENT.name, this.pendingPayment)
                .put(Field.HOME_PICKUP.name, this.homePickup)
                .put(Field.HOME_DELIVERY.name, this.homeDelivery)
                .put(Field.PACKAGES.name, new JSONArray(
                        this.packages.stream().map(Package::toJSON).toList()
                ))
                .put(Field.CANCELLED.name, this.cancelled)
                .put(Field.CREATED_TIMESTAMP.name, this.createdAt.getTime())
                .put(Field.UPDATED_TIMESTAMP.name, this.updatedAt.getTime());
    }

    @Override
    public void validate(@Nonnull String parentName) throws ValidationException {
        if (this.senderRut == null) {
            throw new ValidationException(Field.SENDER_RUT.name, "Sender rut cannot be empty.");
        }

        if (Objects.equals(this.senderRut, this.recipientRut)) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "Sender and recipient cannot be the same.");
        }

        if (!Util.isValidRut(this.senderRut)) {
            throw new ValidationException(Field.SENDER_RUT.name, "Invalid rut.");
        }

        final User sender = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, this.senderRut))
                .first();
        if (sender == null) {
            throw new ValidationException(Field.SENDER_RUT.name, "User with rut " + this.senderRut + " does not exist.");
        }

        if (this.recipientRut == null) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "Recipient rut cannot be empty.");
        }

        if (!Util.isValidRut(this.senderRut)) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "Invalid rut.");
        }

        final User recipient = DatabaseConnection.getUsersCollection()
                .find(Filters.eq(User.Field.RUT.raw, this.recipientRut))
                .first();
        if (recipient == null) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "User with rut " + this.recipientRut + " does not exist.");
        }

        if (this.sourceAddress == null) {
            throw new ValidationException(Field.SOURCE_ADDRESS.name, "Source address cannot be empty.");
        }

        this.sourceAddress.validate(Field.SOURCE_ADDRESS.name);

        if (this.destinationAddress == null) {
            throw new ValidationException(Field.DESTINATION_ADDRESS.name, "Destination address cannot be empty.");
        }

        this.destinationAddress.validate(Field.DESTINATION_ADDRESS.name);

        if (this.sourceAddress.jsonEquals(this.destinationAddress)) {
            throw new ValidationException(
                    Field.DESTINATION_ADDRESS.name,
                    "Source and destination addresses cannot be the same."
            );
        }

        if (this.statusHistory == null || this.statusHistory.isEmpty()) {
            throw new ValidationException(Field.STATUS_HISTORY.name, "Shipment status history cannot be empty.");
        }

        if (this.statusHistory.size() > StatusHistory.Status.values().length) {
            throw new ValidationException(
                    Field.STATUS_HISTORY.name,
                    "Shipment status history contains more statuses than there are possible ones."
            );
        }

        final HashSet<StatusHistory.Status> statuses = new HashSet<>();
        for (int i = 0; i < this.statusHistory.size(); i++) {
            final StatusHistory statusHistory = this.statusHistory.get(i);
            statusHistory.validate(Field.STATUS_HISTORY.name + "[" + i + "]");
            statuses.add(statusHistory.status);
        }

        if (statuses.size() != this.statusHistory.size()) {
            throw new ValidationException(
                    Field.STATUS_HISTORY.name,
                    "Shipment status history cannot contain repeated statuses."
            );
        }

        if (this.shippingType == null) {
            throw new ValidationException(Field.SHIPPING_TYPE.name, "Shipping type cannot be empty.");
        }

        if (this.pendingPayment == null) {
            throw new ValidationException(Field.PENDING_PAYMENT.name, "Pending payment cannot be empty.");
        }

        if (this.homePickup == null) {
            throw new ValidationException(Field.HOME_PICKUP.name, "Home pickup cannot be empty.");
        }

        if (this.homeDelivery == null) {
            throw new ValidationException(Field.HOME_DELIVERY.name, "Home delivery cannot be empty.");
        }

        if (this.packages == null || this.packages.isEmpty()) {
            throw new ValidationException(Field.PACKAGES.name, "Packages cannot be empty.");
        }

        for (int i = 0; i < this.packages.size(); i++) {
            final Package pkg = this.packages.get(i);
            pkg.validate(Field.PACKAGES.name + "[" + i + "]");
        }
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + " " + this.toJSON().toString(2);
    }

    public enum Field {
        ID("id", "_id"),
        SENDER_RUT("sender_rut"),
        RECIPIENT_RUT("recipient_rut"),
        SOURCE_ADDRESS("source_address"),
        DESTINATION_ADDRESS("destination_address"),
        DISPATCH_TIMESTAMP("dispatch_timestamp"),
        DELIVERY_TIMESTAMP("delivery_timestamp"),
        STATUS_HISTORY("status_history"),
        SHIPPING_TYPE("shipping_type"),
        PENDING_PAYMENT("pending_payment"),
        HOME_PICKUP("home_pickup"),
        HOME_DELIVERY("home_delivery"),
        PACKAGES("packages"),
        CANCELLED("cancelled"),
        CREATED_TIMESTAMP("created_at"),
        UPDATED_TIMESTAMP("updated_at");

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
}
