package org.sdproject.api.documentation;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Repeatable(ResponseContainer.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface ResponseDoc {
    String name() default "";

    Class<?> type() default Void.class;

    String description() default "";

    String value() default "";
}
