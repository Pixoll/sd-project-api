package org.sdproject.api.structures;

import org.bson.BsonType;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.codecs.pojo.annotations.BsonRepresentation;
import org.jetbrains.annotations.Nullable;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONObject;

import java.util.Date;

public record User(
        @BsonId() @BsonRepresentation(BsonType.STRING)
        @FieldDoc(description = "The user's RUT.")
        String rut,
        @BsonProperty("first_name")
        @FieldDoc(jsonKey = "first_name", description = "The user's first name.")
        String firstName,
        @BsonProperty("second_name")
        @FieldDoc(jsonKey = "second_name", description = "The user's second name.", optional = true, defaultIsNull = true)
        @Nullable String secondName,
        @BsonProperty("first_last_name")
        @FieldDoc(jsonKey = "first_last_name", description = "The user's first last name.")
        String firstLastName,
        @BsonProperty("second_last_name")
        @FieldDoc(jsonKey = "second_last_name", description = "The user's second last name.", optional = true, defaultIsNull = true)
        @Nullable String secondLastName,
        @FieldDoc(description = "The user's email address.")
        String email,
        @FieldDoc(description = "The user's phone number.")
        Integer phone,
        @FieldDoc(description = "The user's address.")
        Address address,
        @FieldDoc(description = "The user's password.")
        String password,
        @FieldDoc(description = "The user's salt for the password.")
        String salt,
        @FieldDoc(description = "Whether the user has verified their identity or not.")
        boolean verified,
        @FieldDoc(isCreatedTimestamp = true)
        Date createdAt,
        @FieldDoc(isUpdatedTimestamp = true)
        Date updatedAt
) implements Structure {
    private static final int[] RUT_VALIDATION_SEQUENCE = {2, 3, 4, 5, 6, 7};
    public static final String EMAIL_REGEX = "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";

    public User(JSONObject requestBody) {
        this(
                requestBody.optString(Field.RUT.name, null),
                requestBody.optString(Field.FIRST_NAME.name, null),
                requestBody.optString(Field.SECOND_NAME.name, null),
                requestBody.optString(Field.FIRST_LAST_NAME.name, null),
                requestBody.optString(Field.SECOND_LAST_NAME.name, null),
                requestBody.optString(Field.EMAIL.name, null),
                requestBody.optIntegerObject(Field.PHONE.name, null),
                new Address(requestBody.optJSONObject(Field.ADDRESS.name, new JSONObject())),
                requestBody.optString(Field.PASSWORD.name, null),
                requestBody.optString(Field.SALT.name, null),
                false,
                new Date(),
                new Date()
        );
    }

    public enum Field {
        RUT("rut", "_id"),
        FIRST_NAME("first_name"),
        SECOND_NAME("second_name"),
        FIRST_LAST_NAME("first_last_name"),
        SECOND_LAST_NAME("second_last_name"),
        EMAIL("email"),
        PHONE("phone"),
        ADDRESS("address"),
        PASSWORD("password"),
        SALT("salt"),
        VERIFIED("verified"),
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

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.RUT.name, this.rut)
                .put(Field.FIRST_NAME.name, this.firstName)
                .put(Field.SECOND_NAME.name, this.secondName != null ? this.secondName : JSONObject.NULL)
                .put(Field.FIRST_LAST_NAME.name, this.firstLastName)
                .put(Field.SECOND_LAST_NAME.name, this.secondLastName != null ? this.secondLastName : JSONObject.NULL)
                .put(Field.EMAIL.name, this.email)
                .put(Field.PHONE.name, this.phone)
                .put(Field.ADDRESS.name, this.address != null ? this.address.toJSON() : null)
                .put(Field.VERIFIED.name, this.verified)
                .put(Field.CREATED_TIMESTAMP.name, this.createdAt != null ? this.createdAt.getTime() : null)
                .put(Field.UPDATED_TIMESTAMP.name, this.updatedAt != null ? this.updatedAt.getTime() : null);
    }

    @Override
    public void validate() throws ValidationException {
        if (this.rut == null) {
            throw new ValidationException("Rut cannot be empty.");
        }

        validateRut(this.rut);

        if (this.firstName == null || this.firstName.isEmpty()) {
            throw new ValidationException("First name cannot be empty.");
        }

        if (this.firstLastName == null || this.firstLastName.isEmpty()) {
            throw new ValidationException("First last name cannot be empty.");
        }

        if (this.email == null) {
            throw new ValidationException("Email cannot be empty.");
        }

        if (!this.email.matches(EMAIL_REGEX)) {
            throw new ValidationException("Invalid email.");
        }

        if (this.phone == null) {
            throw new ValidationException("Phone number cannot be empty.");
        }

        if (String.valueOf(this.phone).length() != 9) {
            throw new ValidationException("Invalid phone number.");
        }

        if (this.address == null) {
            throw new ValidationException("Address cannot be empty.");
        }

        this.address.validate();

        if (this.password == null || this.password.isEmpty()) {
            throw new ValidationException("Password cannot be empty.");
        }

        if (this.password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters long.");
        }
    }

    public static void validateRut(String rut) throws ValidationException {
        if (!rut.matches("^\\d{7,}-[\\dkK]$")) {
            throw new ValidationException("Invalid rut.");
        }

        final String[] rutParts = rut.split("-");
        final String digits = rutParts[0];
        final String expectedVerificationDigit = rutParts[1];

        if (Integer.parseInt(digits) < 1e6) {
            throw new ValidationException("Invalid rut.");
        }

        int sum = 0;
        for (int i = 0; i < digits.length(); i++) {
            sum += Integer.parseInt(digits.charAt(digits.length() - i - 1) + "")
                    * RUT_VALIDATION_SEQUENCE[i % RUT_VALIDATION_SEQUENCE.length];
        }

        final int verificationNumber = 11 - sum + (sum / 11 * 11);
        final String verificationDigit = verificationNumber == 10 ? "K" : String.valueOf(verificationNumber % 11);

        if (!expectedVerificationDigit.equals(verificationDigit)) {
            throw new ValidationException("Invalid rut.");
        }
    }
}
