package org.sdproject.api.documentation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface HeaderAnyAuthDoc {
    String name() default "Authorization";

    Class<?> type() default String.class;

    String description() default "Session token of the logged-in user or admin. "
            + "See {endpoint:POST /users/session} and {endpoint:POST /admins/session}.";
}
