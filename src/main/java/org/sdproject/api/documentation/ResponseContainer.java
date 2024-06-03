package org.sdproject.api.documentation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface ResponseContainer {
    ResponseDoc[] value();
}
