package org.sdproject.api.structures;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonIgnore;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import org.sdproject.api.DatabaseConnection;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;

import jakarta.annotation.Nonnull;
import java.util.*;

public class Shipment extends Structure implements PopulatableStructure {
    private static final float IVA = 0.19f;
    private static final int HOME_PICKUP_FEE = 1000;
    private static final int HOME_DELIVERY_FEE = 1000;

    @BsonId
    @FieldDoc(description = "The shipment id. Used for tracking.", generated = true)
    public String id;

    @BsonProperty("sender_rut")
    @FieldDoc(jsonKey = "sender_rut", description = "RUT of the sender. Must be of an existing {structure:User}.")
    public String senderRut;

    @BsonIgnore
    public User sender;

    @BsonProperty("recipient_rut")
    @FieldDoc(jsonKey = "recipient_rut", description = "RUT of the recipient. Must be of an existing {structure:User}.")
    public String recipientRut;

    public User recipient;

    @BsonProperty("source_address")
    @FieldDoc(jsonKey = "source_address", description = "Address where the packages are being shipped from.")
    public Address sourceAddress;

    @BsonProperty("destination_address")
    @FieldDoc(jsonKey = "destination_address", description = "Address where the packages are being shipped to.")
    public Address destinationAddress;

    @BsonProperty("status_history")
    @FieldDoc(jsonKey = "status_history", description = "Status history of the shipment.", generated = true)
    public ArrayList<StatusHistory> statusHistory;

    @BsonProperty("shipping_type")
    @FieldDoc(jsonKey = "shipping_type", description = "Type of the shipping.")
    public Type shippingType;

    @BsonProperty("recipient_pays")
    @FieldDoc(jsonKey = "recipient_pays", description = "Whether the shipment is going to be paid by the recipient.")
    public Boolean recipientPays;

    @BsonProperty("home_pickup")
    @FieldDoc(jsonKey = "home_pickup", description = "Whether the packages are being picked up at the sender's address.")
    public Boolean homePickup;

    @BsonProperty("home_delivery")
    @FieldDoc(jsonKey = "home_delivery", description = "Whether the packages are being shipped to the recipient's address.")
    public Boolean homeDelivery;

    @FieldDoc(description = "All the packages being shipped.")
    public ArrayList<Package> packages;

    @FieldDoc(description = "Calculated price of the shipment, including taxes.", generated = true)
    public Integer price;

    @FieldDoc(description = "Whether this shipment was cancelled.", generated = true)
    public boolean cancelled;

    @FieldDoc(description = "Whether this shipment has been completed.", generated = true)
    public boolean completed;

    @FieldDoc(description = "Whether this shipment has been paid.", generated = true)
    public boolean paid;

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

        this.statusHistory = new ArrayList<>();
        this.statusHistory.add(new StatusHistory(StatusHistory.Status.PENDING));

        this.shippingType = Util.stringToEnum(json.optString(Field.SHIPPING_TYPE.name, null), Type.class);
        this.recipientPays = json.optBooleanObject(Field.RECIPIENT_PAYS.name, null);
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

        this.price = this.calculatePrice();
        this.cancelled = false;
        this.completed = false;
        this.paid = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.populate();
        this.validate();
    }

    private int calculatePrice() {
        float price = 0;

        for (final Package pkg : this.packages) {
            price += pkg.calculatePrice();
        }

        if (this.homePickup != null && this.homePickup) price += HOME_PICKUP_FEE;
        if (this.homeDelivery != null && this.homeDelivery) price += HOME_DELIVERY_FEE;

        return Math.round(price * (1 + IVA));
    }

    @Override
    public void populate() {
        final MongoCollection<User> usersCollection = DatabaseConnection.getUsersCollection();

        this.sender = usersCollection.find(Filters.eq(User.Field.RUT.raw, this.senderRut)).first();
        this.recipient = usersCollection.find(Filters.eq(User.Field.RUT.raw, this.recipientRut)).first();
    }

    public StatusHistory.Status currentStatus() {
        this.statusHistory.sort((sh1, sh2) -> Math.toIntExact(sh1.timestamp - sh2.timestamp));
        return this.statusHistory.get(this.statusHistory.size() - 1).status;
    }

    public boolean updateStatus(StatusHistory.Status status) {
        //noinspection ComparatorResultComparison
        if (status.compareTo(this.currentStatus()) != 1) return false;

        this.statusHistory.add(new StatusHistory(status));

        if (status == StatusHistory.Status.DELIVERED) {
            this.completed = true;
        }

        this.updatedAt = new Date();
        return true;
    }

    public void markAsCancelled() {
        this.cancelled = true;
        this.updatedAt = new Date();
    }

    public void markAsPaid() {
        this.paid = true;
        this.updatedAt = new Date();
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.ID.name, this.id)
                .put(Field.SENDER_RUT.name, this.senderRut)
                .put(Field.RECIPIENT_RUT.name, this.recipientRut)
                .put(Field.SOURCE_ADDRESS.name, this.sourceAddress.toJSON())
                .put(Field.DESTINATION_ADDRESS.name, this.destinationAddress.toJSON())
                .put(Field.STATUS_HISTORY.name, new JSONArray(
                        this.statusHistory.stream().map(StatusHistory::toJSON).toList()
                ))
                .put(Field.SHIPPING_TYPE.name, this.shippingType.name)
                .put(Field.RECIPIENT_PAYS.name, this.recipientPays)
                .put(Field.HOME_PICKUP.name, this.homePickup)
                .put(Field.HOME_DELIVERY.name, this.homeDelivery)
                .put(Field.PACKAGES.name, new JSONArray(
                        this.packages.stream().map(Package::toJSON).toList()
                ))
                .put(Field.CANCELLED.name, this.cancelled)
                .put(Field.COMPLETED.name, this.completed)
                .put(Field.PAID.name, this.paid)
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

        if (this.sender == null) {
            throw new ValidationException(Field.SENDER_RUT.name, "Sender with rut " + this.senderRut + " does not exist.");
        }

        if (this.recipientRut == null) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "Recipient rut cannot be empty.");
        }

        if (this.recipient == null) {
            throw new ValidationException(Field.RECIPIENT_RUT.name, "Recipient with rut " + this.recipientRut + " does not exist.");
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

        if (this.recipientPays == null) {
            throw new ValidationException(Field.RECIPIENT_PAYS.name, "Payment by recipient option cannot be empty.");
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
        STATUS_HISTORY("status_history"),
        SHIPPING_TYPE("shipping_type"),
        RECIPIENT_PAYS("recipient_pays"),
        HOME_PICKUP("home_pickup"),
        HOME_DELIVERY("home_delivery"),
        PACKAGES("packages"),
        CANCELLED("cancelled"),
        COMPLETED("completed"),
        PAID("paid"),
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
        SAME_DAY("same_day", 5000),
        FAST("fast", 2500),
        REGULAR("regular", 1000);

        public final String name;
        public final int fee;

        Type(String name, int fee) {
            this.name = name;
            this.fee = fee;
        }

        @Override
        public String toString() {
            return this.name;
        }
    }
}
