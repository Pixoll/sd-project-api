package org.sdproject.api.documentation;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Repeatable(QueryContainer.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface QueryDoc {
    String key();
    Class<?> type();
    String description();
}
