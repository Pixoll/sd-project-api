package org.sdproject.api.documentation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface HeaderUserAuthDoc {
    String name() default "Authorization";

    Class<?> type() default String.class;

    String description() default "Session token of the logged-in user. See {endpoint:POST /users/session}.";
}
