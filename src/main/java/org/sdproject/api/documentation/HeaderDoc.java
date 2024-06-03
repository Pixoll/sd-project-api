package org.sdproject.api.documentation;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Repeatable(HeaderContainer.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface HeaderDoc {
    String name();
    Class<?> type();
    String description();
}
