package org.sdproject.api.structures;

import org.jetbrains.annotations.Nullable;
import org.json.JSONObject;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.endpoints.RegionsEndpoint;

public class Address implements Structure {
    @FieldDoc(description = "The region.")
    public String region;

    @FieldDoc(description = "The city or commune.")
    public String city;

    @FieldDoc(description = "The street name.")
    public String street;

    @FieldDoc(description = "The street number.")
    public Integer number;

    @FieldDoc(description = "Secondary information like apartment building.", optional = true, defaultIsNull = true)
    public @Nullable String secondary;

    public Address() {
    }

    public Address(JSONObject json) throws ValidationException {
        this.region = json.optString(Address.Field.REGION.name, null);
        this.city = json.optString(Address.Field.CITY.name, null);
        this.street = json.optString(Address.Field.STREET.name, null);
        this.number = json.optIntegerObject(Address.Field.NUMBER.name, null);
        this.secondary = json.optString(Address.Field.SECONDARY.name, null);

        this.validate();
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Address.Field.REGION.name, this.region)
                .put(Address.Field.CITY.name, this.city)
                .put(Address.Field.STREET.name, this.street)
                .put(Address.Field.NUMBER.name, this.number)
                .put(Address.Field.SECONDARY.name, this.secondary != null ? this.secondary : JSONObject.NULL);
    }

    @Override
    public void validate() throws ValidationException {
        if (this.region == null || this.region.isEmpty()) {
            throw new ValidationException("Address region name cannot be empty.");
        }

        final JSONObject region = RegionsEndpoint.REGIONS.stream()
                .filter(r -> r.getString("name").equalsIgnoreCase(this.region))
                .findFirst()
                .orElse(null);

        if (region == null) {
            throw new ValidationException("Invalid address region name.");
        }

        if (this.city == null || this.city.isEmpty()) {
            throw new ValidationException("Address city or commune name cannot be empty.");
        }

        final boolean invalidCity = Util.jsonArrayToList(region.getJSONArray("communes"), String.class)
                .stream()
                .noneMatch(c -> c.equalsIgnoreCase(this.city));
        if (invalidCity) {
            throw new ValidationException("Invalid address city or commune name.");
        }

        if (this.street == null || this.street.isEmpty()) {
            throw new ValidationException("Address street name cannot be empty.");
        }

        if (this.number == null) {
            throw new ValidationException("Address street number cannot be empty.");
        }

        if (this.number <= 0) {
            throw new ValidationException("Address street number must be positive.");
        }
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + " " + this.toJSON().toString(2);
    }

    public enum Field {
        REGION("region"),
        CITY("city"),
        STREET("street"),
        NUMBER("number"),
        SECONDARY("secondary");

        public final String name;

        Field(String name) {
            this.name = name;
        }
    }
}
