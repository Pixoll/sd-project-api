package org.sdproject.api.structures;

import org.json.JSONObject;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.endpoints.RegionsEndpoint;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class Address extends Structure {
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

    public Address(JSONObject json, @Nonnull String parentName) throws ValidationException {
        this.region = json.optString(Field.REGION.name, null);
        this.city = json.optString(Field.CITY.name, null);
        this.street = json.optString(Field.STREET.name, null);
        this.number = json.optIntegerObject(Field.NUMBER.name, null);
        this.secondary = json.optString(Field.SECONDARY.name, null);

        this.validate(parentName);
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.REGION.name, this.region)
                .put(Field.CITY.name, this.city)
                .put(Field.STREET.name, this.street)
                .put(Field.NUMBER.name, this.number)
                .put(Field.SECONDARY.name, this.secondary != null ? this.secondary : JSONObject.NULL);
    }

    @Override
    public void validate(@Nonnull String parentName) throws ValidationException {
        final String keyPrefix = parentName.isEmpty() ? "" : parentName + ".";

        if (this.region == null || this.region.isEmpty()) {
            throw new ValidationException(keyPrefix + Field.REGION.name, "Address region name cannot be empty.");
        }

        final JSONObject region = RegionsEndpoint.REGIONS.stream()
                .filter(r -> r.getString("name").equalsIgnoreCase(this.region))
                .findFirst()
                .orElse(null);

        if (region == null) {
            throw new ValidationException(keyPrefix + Field.REGION.name, "Invalid address region name.");
        }

        if (this.city == null || this.city.isEmpty()) {
            throw new ValidationException(keyPrefix + Field.CITY.name, "Address city or commune name cannot be empty.");
        }

        final boolean invalidCity = Util.jsonArrayToList(region.getJSONArray("communes"), String.class)
                .stream()
                .noneMatch(c -> c.equalsIgnoreCase(this.city));
        if (invalidCity) {
            throw new ValidationException(keyPrefix + Field.CITY.name, "Invalid address city or commune name.");
        }

        if (this.street == null || this.street.isEmpty()) {
            throw new ValidationException(keyPrefix + Field.STREET.name, "Address street name cannot be empty.");
        }

        if (this.number == null) {
            throw new ValidationException(keyPrefix + Field.NUMBER.name, "Address street number cannot be empty.");
        }

        if (this.number <= 0) {
            throw new ValidationException(keyPrefix + Field.NUMBER.name, "Address street number must be positive.");
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
