package org.sdproject.api.documentation;

import io.javalin.http.HttpStatus;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Repeatable(CodeContainer.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface CodeDoc {
    HttpStatus code();
    String reason();
}
