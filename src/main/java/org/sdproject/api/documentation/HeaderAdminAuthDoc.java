package org.sdproject.api.documentation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface HeaderAdminAuthDoc {
    String name() default "Authorization";

    Class<?> type() default String.class;

    String description() default "Session token of the logged-in admin. See {endpoint:POST /admins/session}.";
}
