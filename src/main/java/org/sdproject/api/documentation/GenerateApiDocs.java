package org.sdproject.api.documentation;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.sdproject.api.endpoints.*;
import org.sdproject.api.structures.*;
import org.sdproject.api.structures.Package;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

public class GenerateApiDocs {
    private static final String ISO_TIMESTAMP = "[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp";
    private static final Pattern LINKS_REGEX = Pattern.compile("\\{(?:structure:(\\w+)|file:([^}]+)|endpoint:([^}]+))}");
    private static final String BASE_DOCS;
    private static final Endpoint[] ENDPOINTS = new Endpoint[]{
            new AdminsEndpoint(),
            new AdminsSessionEndpoint(),
            new FeesEndpoint(),
            new PingEndpoint(),
            new RegionsEndpoint(),
            new ShipmentsEndpoint(),
            new UsersEndpoint(),
            new UsersMeEndpoint(),
            new UsersSessionEndpoint(),
            new UsersVerifyIdEndpoint(),
    };
    private static final List<String> POSSIBLE_ENDPOINTS = Arrays.stream(Endpoint.AllMethods.class.getMethods())
            .map(Method::getName)
            .toList();
    private static final List<Class<?>> STRUCTURES = Arrays.asList(
            Address.class,
            Admin.class,
            Package.class,
            Shipment.class,
            User.class
    );

    static {
        try {
            BASE_DOCS = Resources.toString(Resources.getResource("base.md"), Charsets.UTF_8) + "\n";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        final StringBuilder result = new StringBuilder();

        final HashMap<String, String> endpointPathToLinkMap = new HashMap<>();

        for (final Class<?> structure : STRUCTURES) {
            result.append("### ")
                    .append(structure.getSimpleName())
                    .append(" Object\n\n| Field | Type | Description |\n| --- | --- | --- |\n");

            for (final Field field : structure.getDeclaredFields()) {
                final FieldDoc fieldDoc = field.getAnnotation(FieldDoc.class);
                if (fieldDoc == null) continue;

                if (fieldDoc.isCreatedTimestamp()) {
                    result.append("| created_timestamp | ")
                            .append(ISO_TIMESTAMP)
                            .append(" | When the object was created. |\n");
                    continue;
                }

                if (fieldDoc.isUpdatedTimestamp()) {
                    result.append("| updated_timestamp | ")
                            .append(ISO_TIMESTAMP)
                            .append(" | When the object was last updated. |\n");
                    continue;
                }

                final String fieldName = fieldDoc.jsonKey().isEmpty() ? field.getName() : fieldDoc.jsonKey();
                result.append("| ").append(fieldName);

                if (fieldDoc.optional() && !fieldDoc.defaultIsNull()) {
                    result.append("?");
                }

                result.append(" | ");

                if (fieldDoc.defaultIsNull()) {
                    result.append("?");
                }

                result.append(parseFieldType(field.getType(), field.getGenericType(), fieldName))
                        .append(" | ")
                        .append(fieldDoc.description());

                if (!field.getType().isEnum()) {
                    result.append(" |\n");
                    continue;
                }

                result.append(" One of: ")
                        .append(String.join(
                                ", ",
                                Arrays.stream(field.getType().getEnumConstants()).map(e -> "`" + e + "`").toList()
                        ))
                        .append(". |\n");
            }

            result.append("\n");
        }

        for (final Endpoint endpoint : ENDPOINTS) {
            final Method[] methods = new Method[POSSIBLE_ENDPOINTS.size()];

            for (final Method method : endpoint.getClass().getDeclaredMethods()) {
                if (POSSIBLE_ENDPOINTS.contains(method.getName())) {
                    methods[POSSIBLE_ENDPOINTS.indexOf(method.getName())] = method;
                }
            }

            for (final Method method : methods) {
                if (method == null) continue;

                final MethodDoc methodDoc = method.getAnnotation(MethodDoc.class);
                if (methodDoc == null) continue;

                final String url = method.getName().toUpperCase() + " " + endpoint.path;
                endpointPathToLinkMap.put(url, methodDoc.name().toLowerCase().replaceAll(" ", "-"));

                result.append("### ")
                        .append(methodDoc.name())
                        .append("\n\n")
                        .append(methodDoc.description())
                        .append("\n\n#### URL\n\n```\n")
                        .append(url)
                        .append("\n```\n\n");

                final HeaderDoc[] headerDocs = method.getAnnotationsByType(HeaderDoc.class);
                if (headerDocs.length > 0) {
                    result.append("#### Request Headers\n\n| Name | Type | Description |\n| --- | --- | --- |\n");

                    for (final HeaderDoc headerDoc : headerDocs) {
                        result.append("| ")
                                .append(headerDoc.name())
                                .append(" | ")
                                .append(parseClassType(headerDoc.type()))
                                .append(" | ")
                                .append(headerDoc.description())
                                .append(" |\n");
                    }

                    result.append("\n");
                }

                final QueryDoc[] queryDocs = method.getAnnotationsByType(QueryDoc.class);
                if (queryDocs.length > 0) {
                    result.append("#### Request Query Parameters\n\n| Name | Type | Description |\n| --- | --- | --- |\n");

                    for (final QueryDoc queryDoc : queryDocs) {
                        result.append("| ")
                                .append(queryDoc.key())
                                .append(" | ")
                                .append(parseClassType(queryDoc.type()))
                                .append(" | ")
                                .append(queryDoc.description())
                                .append(" |\n");
                    }

                    result.append("\n");
                }

                final BodyDoc[] bodyDocs = method.getAnnotationsByType(BodyDoc.class);
                if (bodyDocs.length > 0) {
                    result.append("#### Request Body\n\n");

                    if (bodyDocs.length == 1 && !bodyDocs[0].value().isEmpty()) {
                        result.append(bodyDocs[0].value())
                                .append("\n");
                    } else {
                        result.append("| Field | Type | Description |\n| --- | --- | --- |\n");

                        for (final BodyDoc bodyDoc : bodyDocs) {
                            result.append("| ")
                                    .append(bodyDoc.name())
                                    .append(" | ")
                                    .append(parseClassType(bodyDoc.type()))
                                    .append(" | ")
                                    .append(bodyDoc.description())
                                    .append(" |\n");
                        }
                    }

                    result.append("\n");
                }

                final ResponseDoc[] responseDocs = method.getAnnotationsByType(ResponseDoc.class);
                if (responseDocs.length > 0) {
                    result.append("#### Response Body\n\n");

                    if (responseDocs.length == 1 && !responseDocs[0].value().isEmpty()) {
                        result.append(responseDocs[0].value())
                                .append("\n");
                    } else {
                        result.append("| Field | Type | Description |\n| --- | --- | --- |\n");

                        for (final ResponseDoc responseDoc : responseDocs) {
                            result.append("| ")
                                    .append(responseDoc.name())
                                    .append(" | ")
                                    .append(parseClassType(responseDoc.type()))
                                    .append(" | ")
                                    .append(responseDoc.description())
                                    .append(" |\n");
                        }
                    }

                    result.append("\n");
                }

                final CodeDoc[] codeDocs = method.getAnnotationsByType(CodeDoc.class);
                if (codeDocs.length > 0) {
                    result.append("#### Response Codes\n\n| HTTP Code | Reason |\n| --- | --- |\n");

                    for (final CodeDoc codeDoc : codeDocs) {
                        result.append("| ")
                                .append(codeDoc.code().toString())
                                .append(" | ")
                                .append(codeDoc.reason())
                                .append(" |\n");
                    }
                }
            }
        }

        try (final FileWriter writer = new FileWriter("README.md")) {
            writer.write(LINKS_REGEX.matcher(BASE_DOCS + result).replaceAll(matchResult -> {
                final String structure = matchResult.group(1);
                final String file = matchResult.group(2);
                final String endpoint = matchResult.group(3);
                return structure != null ? "[" + structure.toLowerCase() + "](#" + structure.toLowerCase() + "-object)"
                        : file != null ? "[" + file + "](" + file + ")"
                        : "[" + endpoint + "](#" + endpointPathToLinkMap.get(endpoint) + ")";
            }));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String parseClassType(Class<?> type) {
        return parseFieldType(type, null, null);
    }

    private static String parseFieldType(Class<?> type, Type generic, String name) {
        if (List.class.isAssignableFrom(type)) {
            if (!(generic instanceof ParameterizedType parameter)) {
                return "array of objects";
            }

            final Type[] parameters = parameter.getActualTypeArguments();
            if (parameters.length == 0) {
                return "array of objects";
            }

            return "array of " + parseFieldType((Class<?>) parameters[0], null, name) + "s";
        }

        if (type.isEnum()) {
            return "string";
        }

        if (name != null && name.endsWith("timestamp")) {
            return ISO_TIMESTAMP;
        }

        if (STRUCTURES.contains(type)) {
            return "{structure:" + type.getSimpleName() + "} object";
        }

        return type.getSimpleName().toLowerCase();
    }
}
