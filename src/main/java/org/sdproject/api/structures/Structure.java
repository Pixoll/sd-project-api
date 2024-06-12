package org.sdproject.api.structures;

import org.json.JSONObject;
import org.sdproject.api.documentation.FieldDoc;

import javax.annotation.Nonnull;
import java.lang.reflect.Field;
import java.util.ArrayList;

public abstract class Structure implements Cloneable {
    public abstract void validate(@Nonnull String parentName) throws ValidationException;

    public abstract JSONObject toJSON();

    public abstract String toString();

    public void validate() throws ValidationException {
        this.validate("");
    }

    public boolean jsonEquals(@Nonnull Structure other) {
        return other.toJSON().toString().equals(this.toJSON().toString());
    }

    @Override
    public Structure clone() {
        try {
            final Structure structure = (Structure) super.clone();

            for (final Field field : structure.getClass().getDeclaredFields()) {
                if (!field.isAnnotationPresent(FieldDoc.class) || !Cloneable.class.isAssignableFrom(field.getType())) {
                    continue;
                }

                if (Structure.class.isAssignableFrom(field.getType())) {
                    final Structure nestedStructure = (Structure) field.get(structure);
                    field.set(structure, nestedStructure.clone());
                }

                if (ArrayList.class.isAssignableFrom(field.getType())) {
                    final ArrayList<Object> newArray = new ArrayList<>();

                    //noinspection unchecked
                    for (final Object o : (ArrayList<Object>) field.get(structure)) {
                        newArray.add(Structure.class.isAssignableFrom(o.getClass()) ? ((Structure) o).clone() : o);
                    }

                    field.set(structure, newArray);
                }
            }

            return structure;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
