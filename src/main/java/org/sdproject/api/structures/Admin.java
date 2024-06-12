package org.sdproject.api.structures;

import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;
import org.sdproject.api.Util;
import org.sdproject.api.documentation.FieldDoc;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Date;

public class Admin extends Structure implements UpdatableStructure {
    @BsonId
    @FieldDoc(description = "The admin's RUT.")
    public String rut;

    @BsonProperty("first_name")
    @FieldDoc(jsonKey = "first_name", description = "The admin's first name.")
    public String firstName;

    @BsonProperty("second_name")
    @FieldDoc(jsonKey = "second_name", description = "The admin's second name.", optional = true, defaultIsNull = true)
    public @Nullable String secondName;

    @BsonProperty("first_last_name")
    @FieldDoc(jsonKey = "first_last_name", description = "The admin's first last name.")
    public String firstLastName;

    @BsonProperty("second_last_name")
    @FieldDoc(jsonKey = "second_last_name", description = "The admin's second last name.", optional = true, defaultIsNull = true)
    public @Nullable String secondLastName;

    @FieldDoc(description = "The admin's email address.")
    public String email;

    @FieldDoc(description = "The admin's phone number.")
    public Integer phone;

    @FieldDoc(description = "The admin's password.")
    public String password;

    @FieldDoc(description = "The admin's salt for the password.")
    public String salt;

    @BsonProperty("created_at")
    @FieldDoc(isCreatedTimestamp = true)
    public Date createdAt;

    @BsonProperty("updated_at")
    @FieldDoc(isUpdatedTimestamp = true)
    public Date updatedAt;

    public Admin() {
    }

    public Admin(JSONObject json) throws ValidationException {
        this.rut = json.optString(Field.RUT.name, null);
        this.firstName = json.optString(Field.FIRST_NAME.name, null);
        this.secondName = json.optString(Field.SECOND_NAME.name, null);
        this.firstLastName = json.optString(Field.FIRST_LAST_NAME.name, null);
        this.secondLastName = json.optString(Field.SECOND_LAST_NAME.name, null);
        this.email = json.optString(Field.EMAIL.name, null);
        this.phone = json.optIntegerObject(Field.PHONE.name, null);
        this.password = json.optString(Field.PASSWORD.name, null);
        this.salt = json.optString(Field.SALT.name, null);
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.validate();
    }

    @Override
    public void updateFromJSON(@NotNull JSONObject json, @NotNull String parentName) throws ValidationException {
        final Admin original = (Admin) this.clone();

        this.firstName = json.optString(Field.FIRST_NAME.name, this.firstName);
        this.secondName = json.optString(Field.SECOND_NAME.name, this.secondName);
        this.firstLastName = json.optString(Field.FIRST_LAST_NAME.name, this.firstLastName);
        this.secondLastName = json.optString(Field.SECOND_LAST_NAME.name, this.secondLastName);
        this.email = json.optString(Field.EMAIL.name, this.email);
        this.phone = json.optIntegerObject(Field.PHONE.name, this.phone);

        final boolean updatePassword = json.has(Field.PASSWORD.name);
        if (updatePassword) {
            this.password = json.getString(Field.PASSWORD.name);
        }

        this.validate();

        if (this.jsonEquals(original)) return;

        this.updatedAt = new Date();

        if (updatePassword) {
            this.salt = Util.generateSalt();
            this.password = Util.hashPassword(this.password, this.salt);
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
    public void validate(@Nonnull String parentName) throws ValidationException {
        if (this.rut == null || this.rut.isEmpty()) {
            throw new ValidationException(Field.RUT.name, "Rut cannot be empty.");
        }

        if (!Util.isValidRut(this.rut)) {
            throw new ValidationException(Field.RUT.name, "Invalid rut.");
        }

        if (this.firstName == null || this.firstName.isEmpty()) {
            throw new ValidationException(Field.FIRST_NAME.name, "First name cannot be empty.");
        }

        if (this.firstLastName == null || this.firstLastName.isEmpty()) {
            throw new ValidationException(Field.FIRST_LAST_NAME.name, "First last name cannot be empty.");
        }

        if (this.email == null || this.email.isEmpty()) {
            throw new ValidationException(Field.EMAIL.name, "Email cannot be empty.");
        }

        if (!this.email.matches(Util.EMAIL_REGEX)) {
            throw new ValidationException(Field.EMAIL.name, "Invalid email.");
        }

        if (this.phone == null) {
            throw new ValidationException(Field.PHONE.name, "Phone number cannot be empty.");
        }

        if (String.valueOf(this.phone).length() != 9) {
            throw new ValidationException(Field.PHONE.name, "Invalid phone number.");
        }

        if (this.password == null || this.password.isEmpty()) {
            throw new ValidationException(Field.PASSWORD.name, "Password cannot be empty.");
        }

        if (this.password.length() < 8) {
            throw new ValidationException(Field.PASSWORD.name, "Password must be at least 8 characters long.");
        }
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + " " + this.toJSON().toString(2);
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
}
