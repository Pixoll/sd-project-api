package org.sdproject.api.structures;

import org.sdproject.api.documentation.FieldDoc;
import org.sdproject.api.json.JSONObject;

public class Package implements Structure {
    @FieldDoc(description = "Type of the package.")
    public Type type;

    @FieldDoc(description = "Brief description of what the package contains.")
    public String description;

    @FieldDoc(description = "Length of the package in mm.")
    public Float length;

    @FieldDoc(description = "Width of the package in mm.")
    public Float width;

    @FieldDoc(description = "Height of the package in mm.")
    public Float height;

    @FieldDoc(description = "Weight of the package in kg.")
    public Float weight;

    public Package() {
    }

    public Package(JSONObject json) throws ValidationException {
        this.type = json.optEnum(Type.class, Field.TYPE.name, null);
        this.description = json.optString(Field.DESCRIPTION.name, null);
        this.length = json.optFloatObject(Field.LENGTH.name, null);
        this.width = json.optFloatObject(Field.WIDTH.name, null);
        this.height = json.optFloatObject(Field.HEIGHT.name, null);
        this.weight = json.optFloatObject(Field.WEIGHT.name, null);

        this.validate();
    }

    @Override
    public JSONObject toJSON() {
        return new JSONObject()
                .put(Field.TYPE.name, this.type.name)
                .put(Field.DESCRIPTION.name, this.description)
                .put(Field.LENGTH.name, this.length)
                .put(Field.WIDTH.name, this.width)
                .put(Field.HEIGHT.name, this.height)
                .put(Field.WEIGHT.name, this.weight);
    }

    @Override
    public void validate() throws ValidationException {
        if (this.type == null) {
            throw new ValidationException("Package type cannot be empty.");
        }

        if (this.description == null || this.description.isEmpty()) {
            throw new ValidationException("Package description cannot be empty.");
        }

        if (this.length == null) {
            throw new ValidationException("Package length cannot be empty.");
        }

        if (this.length <= 0) {
            throw new ValidationException("Package length cannot be zero or negative.");
        }

        if (this.width == null) {
            throw new ValidationException("Package width cannot be empty.");
        }

        if (this.width <= 0) {
            throw new ValidationException("Package width cannot be zero or negative.");
        }

        if (this.height == null) {
            throw new ValidationException("Package height cannot be empty.");
        }

        if (this.height <= 0) {
            throw new ValidationException("Package height cannot be zero or negative.");
        }

        if (this.weight == null) {
            throw new ValidationException("Package weight cannot be empty.");
        }

        if (this.weight <= 0) {
            throw new ValidationException("Package weight cannot be zero or negative.");
        }
    }

    @Override
    public String toString() {
        return Package.class.getSimpleName() + " " + this.toJSON().toString(2);
    }

    public enum Field {
        TYPE("type"),
        DESCRIPTION("description"),
        LENGTH("length"),
        WIDTH("width"),
        HEIGHT("height"),
        WEIGHT("weight");

        public final String name;

        Field(String name) {
            this.name = name;
        }
    }

    public enum Type {
        DOCUMENT("document"),
        PACKAGE("package");

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
