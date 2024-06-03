package org.sdproject.api.structures;

import org.bson.BsonType;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.codecs.pojo.annotations.BsonRepresentation;
import org.jetbrains.annotations.Nullable;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONObject;

import java.util.Date;

public record Admin(
        @BsonId() @BsonRepresentation(BsonType.STRING)
        @FieldDoc(description = "The admin's RUT.")
        String rut,
        @BsonProperty("first_name")
        @FieldDoc(jsonKey = "first_name", description = "The admin's first name.")
        String firstName,
        @BsonProperty("second_name")
        @FieldDoc(jsonKey = "second_name", description = "The admin's second name.", optional = true, defaultIsNull = true)
        @Nullable String secondName,
        @BsonProperty("first_last_name")
        @FieldDoc(jsonKey = "first_last_name", description = "The admin's first last name.")
        String firstLastName,
        @BsonProperty("second_last_name")
        @FieldDoc(jsonKey = "second_last_name", description = "The admin's second last name.", optional = true, defaultIsNull = true)
        @Nullable String secondLastName,
        @FieldDoc(description = "The admin's email address.")
        String email,
        @FieldDoc(description = "The admin's phone number.")
        Integer phone,
        @FieldDoc(description = "The admin's password.")
        String password,
        @FieldDoc(description = "The admin's salt for the password.")
        String salt,
        @FieldDoc(isCreatedTimestamp = true)
        Date createdAt,
        @FieldDoc(isUpdatedTimestamp = true)
        Date updatedAt
) implements Structure {
    public Admin(JSONObject json) {
        this(
                json.optString(Field.RUT.name, null),
                json.optString(Field.FIRST_NAME.name, null),
                json.optString(Field.SECOND_NAME.name, null),
                json.optString(Field.FIRST_LAST_NAME.name, null),
                json.optString(Field.SECOND_LAST_NAME.name, null),
                json.optString(Field.EMAIL.name, null),
                json.optIntegerObject(Field.PHONE.name, null),
                json.optString(Field.PASSWORD.name, null),
                json.optString(Field.SALT.name, null),
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
        PASSWORD("password"),
        SALT("salt"),
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
                .put(Field.CREATED_TIMESTAMP.name, this.createdAt.getTime())
                .put(Field.UPDATED_TIMESTAMP.name, this.updatedAt.getTime());
    }

    @Override
    public void validate() throws ValidationException {
        if (this.rut == null || this.rut.isEmpty()) {
            throw new ValidationException("Rut cannot be empty.");
        }

        User.validateRut(this.rut);

        if (this.firstName == null || this.firstName.isEmpty()) {
            throw new ValidationException("First name cannot be empty.");
        }

        if (this.firstLastName == null || this.firstLastName.isEmpty()) {
            throw new ValidationException("First last name cannot be empty.");
        }

        if (this.email == null || this.email.isEmpty()) {
            throw new ValidationException("Email cannot be empty.");
        }

        if (!this.email.matches(User.EMAIL_REGEX)) {
            throw new ValidationException("Invalid email.");
        }

        if (this.phone == null) {
            throw new ValidationException("Phone number cannot be empty.");
        }

        if (String.valueOf(this.phone).length() != 9) {
            throw new ValidationException("Invalid phone number.");
        }

        if (this.password == null || this.password.isEmpty()) {
            throw new ValidationException("Password cannot be empty.");
        }

        if (this.password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters long.");
        }
    }
}
