package org.sdproject.api.structures;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.jetbrains.annotations.Nullable;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONObject;

import java.util.Date;

public class User implements Structure {
    public static final String EMAIL_REGEX = "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
    private static final int[] RUT_VALIDATION_SEQUENCE = {2, 3, 4, 5, 6, 7};

    @BsonId()
    @FieldDoc(description = "The user's RUT.")
    public String rut;

    @BsonProperty("first_name")
    @FieldDoc(jsonKey = "first_name", description = "The user's first name.")
    public String firstName;

    @BsonProperty("second_name")
    @FieldDoc(jsonKey = "second_name", description = "The user's second name.", optional = true, defaultIsNull = true)
    public @Nullable String secondName;

    @BsonProperty("first_last_name")
    @FieldDoc(jsonKey = "first_last_name", description = "The user's first last name.")
    public String firstLastName;

    @BsonProperty("second_last_name")
    @FieldDoc(jsonKey = "second_last_name", description = "The user's second last name.", optional = true, defaultIsNull = true)
    public @Nullable String secondLastName;

    @FieldDoc(description = "The user's email address.")
    public String email;

    @FieldDoc(description = "The user's phone number.")
    public Integer phone;

    @FieldDoc(description = "The user's address.")
    public Address address;

    @FieldDoc(description = "The user's password.")
    public String password;

    @FieldDoc(description = "The user's salt for the password.")
    public String salt;

    @FieldDoc(description = "Whether the user has verified their identity or not.")
    public boolean verified;

    @BsonProperty("created_at")
    @FieldDoc(isCreatedTimestamp = true)
    public Date createdAt;

    @BsonProperty("updated_at")
    @FieldDoc(isUpdatedTimestamp = true)
    public Date updatedAt;

    public User() {
    }

    public User(JSONObject json) throws ValidationException {
        this.rut = json.optString(User.Field.RUT.name, null);
        this.firstName = json.optString(User.Field.FIRST_NAME.name, null);
        this.secondName = json.optString(User.Field.SECOND_NAME.name, null);
        this.firstLastName = json.optString(User.Field.FIRST_LAST_NAME.name, null);
        this.secondLastName = json.optString(User.Field.SECOND_LAST_NAME.name, null);
        this.email = json.optString(User.Field.EMAIL.name, null);
        this.phone = json.optIntegerObject(User.Field.PHONE.name, null);
        this.address = new Address(json.optJSONObject(User.Field.ADDRESS.name, new JSONObject()));
        this.password = json.optString(User.Field.PASSWORD.name, null);
        this.salt = json.optString(User.Field.SALT.name, null);
        this.verified = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.validate();
    }

    public static void validateRut(String rut) throws ValidationException {
        if (!rut.matches("^\\d{7,}-[\\dkK]$")) {
            throw new ValidationException("Invalid rut.");
        }

        final String[] rutParts = rut.split("-");
        final String digits = rutParts[0];
        final String expectedVerificationDigit = rutParts[1];
        final String verificationDigit = calculateVerificationCode(digits);

        if (!expectedVerificationDigit.equals(verificationDigit)) {
            throw new ValidationException("Invalid rut.");
        }
    }

    private static String calculateVerificationCode(String digits) throws ValidationException {
        if (Integer.parseInt(digits) < 1e6) {
            throw new ValidationException("Invalid rut.");
        }

        int sum = 0;
        for (int i = 0; i < digits.length(); i++) {
            sum += Integer.parseInt(digits.charAt(digits.length() - i - 1) + "")
                    * RUT_VALIDATION_SEQUENCE[i % RUT_VALIDATION_SEQUENCE.length];
        }

        final int verificationNumber = 11 - sum + (sum / 11 * 11);
        return verificationNumber == 10 ? "K" : String.valueOf(verificationNumber % 11);
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(User.Field.RUT.name, this.rut)
                .put(User.Field.FIRST_NAME.name, this.firstName)
                .put(User.Field.SECOND_NAME.name, this.secondName != null ? this.secondName : JSONObject.NULL)
                .put(User.Field.FIRST_LAST_NAME.name, this.firstLastName)
                .put(User.Field.SECOND_LAST_NAME.name, this.secondLastName != null ? this.secondLastName : JSONObject.NULL)
                .put(User.Field.EMAIL.name, this.email)
                .put(User.Field.PHONE.name, this.phone)
                .put(User.Field.ADDRESS.name, this.address.toJSON())
                .put(User.Field.VERIFIED.name, this.verified)
                .put(User.Field.CREATED_TIMESTAMP.name, this.createdAt.getTime())
                .put(User.Field.UPDATED_TIMESTAMP.name, this.updatedAt.getTime());
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

    @Override
    public String toString() {
        return User.class.getSimpleName() + " " + this.toJSON().toString(2);
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
        CREATED_TIMESTAMP("created_at", "createdAt"),
        UPDATED_TIMESTAMP("updated_at", "updatedAt");

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
}
