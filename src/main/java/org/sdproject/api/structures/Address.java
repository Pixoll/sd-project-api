package org.sdproject.api.structures;

import org.jetbrains.annotations.Nullable;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONObject;
import org.sdproject.api.endpoints.RegionsEndpoint;

public record Address(
        @FieldDoc(description = "The region.")
        String region,
        @FieldDoc(description = "The city or commune.")
        String city,
        @FieldDoc(description = "The street name.")
        String street,
        @FieldDoc(description = "The street number.")
        Integer number,
        @FieldDoc(description = "Secondary information like apartment building.", optional = true, defaultIsNull = true)
        @Nullable String secondary
) implements Structure {
    public Address(JSONObject requestBody) {
        this(
                requestBody.optString(Field.REGION.name, null),
                requestBody.optString(Field.CITY.name, null),
                requestBody.optString(Field.STREET.name, null),
                requestBody.optIntegerObject(Field.NUMBER.name, null),
                requestBody.optString(Field.SECONDARY.name, null)
        );
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

        final boolean invalidCity = region.getJSONArray("communes").toList(String.class)
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
}
