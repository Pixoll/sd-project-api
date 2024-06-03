package org.sdproject.api.documentation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface FieldDoc {
    String jsonKey() default "";
    String description() default "";
    boolean optional() default false;
    boolean defaultIsNull() default false;
    boolean isCreatedTimestamp() default false;
    boolean isUpdatedTimestamp() default false;
}
