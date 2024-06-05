package org.sdproject.api.documentation;

import com.google.common.base.Charsets;
import com.google.common.base.Strings;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.function.Function;
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
    private static final HashMap<String, String> ENDPOINT_PATH_TO_LINK = new HashMap<>();
    private static final ArrayList<Method> ALL_ENDPOINT_METHODS = new ArrayList<>();
    private static final HashMap<Method, String> ENDPOINT_METHOD_TO_URL = new HashMap<>();

    static {
        try {
            BASE_DOCS = Resources.toString(Resources.getResource("base.md"), Charsets.UTF_8) + "\n";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        for (final Endpoint endpoint : ENDPOINTS) {
            final Method[] methods = new Method[POSSIBLE_ENDPOINTS.size()];

            for (final Method method : endpoint.getClass().getDeclaredMethods()) {
                if (!POSSIBLE_ENDPOINTS.contains(method.getName())) continue;

                final MethodDoc methodDoc = method.getAnnotation(MethodDoc.class);
                if (methodDoc == null) continue;

                final String url = method.getName().toUpperCase() + " " + endpoint.path;

                ENDPOINT_PATH_TO_LINK.put(url, methodDoc.name().toLowerCase().replaceAll(" ", "-"));
                ENDPOINT_METHOD_TO_URL.put(method, url);
                methods[POSSIBLE_ENDPOINTS.indexOf(method.getName())] = method;
            }

            for (final Method method : methods)
                if (method != null)
                    ALL_ENDPOINT_METHODS.add(method);
        }
    }

    public static void main(String[] args) {
        final StringBuilder result = new StringBuilder();

        for (final Class<?> structure : STRUCTURES) {
            final MarkdownTable table = new MarkdownTable("Field", "Type", "Description");

            result.append("### ")
                    .append(structure.getSimpleName())
                    .append(" Object\n\n");

            for (final Field field : structure.getDeclaredFields()) {
                final FieldDoc fieldDoc = field.getAnnotation(FieldDoc.class);
                if (fieldDoc == null) continue;

                if (fieldDoc.isCreatedTimestamp()) {
                    table.addRow("created_timestamp", ISO_TIMESTAMP, "When the object was created.");
                    continue;
                }

                if (fieldDoc.isUpdatedTimestamp()) {
                    table.addRow("updated_timestamp", ISO_TIMESTAMP, "When the object was last updated.");
                    continue;
                }

                final String fieldName = fieldDoc.jsonKey().isEmpty() ? field.getName() : fieldDoc.jsonKey();
                final String optionalField = fieldDoc.optional() && !fieldDoc.defaultIsNull() ? "?" : "";
                final String nullableType = fieldDoc.defaultIsNull() ? "?" : "";
                final String fieldType = parseFieldType(field.getType(), field.getGenericType(), fieldName);
                String description = fieldDoc.description();

                if (field.getType().isEnum()) {
                    description += " One of: " + String.join(
                            ", ",
                            Arrays.stream(field.getType().getEnumConstants()).map(e -> "`" + e + "`").toList()
                    ) + ".";
                }

                table.addRow(
                        fieldName + optionalField,
                        nullableType + replaceMarkdownReferences(fieldType),
                        replaceMarkdownReferences(description)
                );
            }

            result.append(table)
                    .append("\n");
        }

        result.append("## Endpoints\n\n");


        for (final Method method : ALL_ENDPOINT_METHODS) {
            final MethodDoc methodDoc = method.getAnnotation(MethodDoc.class);

            result.append("### ")
                    .append(methodDoc.name())
                    .append("\n\n")
                    .append(replaceMarkdownReferences(methodDoc.description()))
                    .append("\n\n#### URL\n\n```\n")
                    .append(ENDPOINT_METHOD_TO_URL.get(method))
                    .append("\n```\n\n");

            final HeaderDoc[] headerDocs = method.getAnnotationsByType(HeaderDoc.class);
            if (headerDocs.length > 0) {
                result.append("#### Request Headers\n\n")
                        .append(new MarkdownTable("Name", "Type", "Description")
                                .addRows(headerDocs, headerDoc -> new String[]{
                                        headerDoc.name(),
                                        parseClassType(headerDoc.type()),
                                        replaceMarkdownReferences(headerDoc.description())
                                }))
                        .append("\n");
            }

            final QueryDoc[] queryDocs = method.getAnnotationsByType(QueryDoc.class);
            if (queryDocs.length > 0) {
                result.append("#### Request Query Parameters\n\n")
                        .append(new MarkdownTable("Name", "Type", "Description")
                                .addRows(queryDocs, queryDoc -> new String[]{
                                        queryDoc.key(),
                                        parseClassType(queryDoc.type()),
                                        replaceMarkdownReferences(queryDoc.description())
                                }))
                        .append("\n");
            }

            final BodyDoc[] bodyDocs = method.getAnnotationsByType(BodyDoc.class);
            if (bodyDocs.length > 0) {
                result.append("#### Request Body\n\n");

                if (bodyDocs.length == 1 && !bodyDocs[0].value().isEmpty()) {
                    result.append(replaceMarkdownReferences(bodyDocs[0].value()))
                            .append("\n");
                } else {
                    result.append(new MarkdownTable("Field", "Type", "Description")
                            .addRows(bodyDocs, bodyDoc -> new String[]{
                                    bodyDoc.name(),
                                    parseClassType(bodyDoc.type()),
                                    replaceMarkdownReferences(bodyDoc.description())
                            }));
                }

                result.append("\n");
            }

            final ResponseDoc[] responseDocs = method.getAnnotationsByType(ResponseDoc.class);
            if (responseDocs.length > 0) {
                result.append("#### Response Body\n\n");

                if (responseDocs.length == 1 && !responseDocs[0].value().isEmpty()) {
                    result.append(replaceMarkdownReferences(responseDocs[0].value()))
                            .append("\n");
                } else {
                    result.append(new MarkdownTable("Field", "Type", "Description")
                            .addRows(responseDocs, responseDoc -> new String[]{
                                    responseDoc.name(),
                                    parseClassType(responseDoc.type()),
                                    replaceMarkdownReferences(responseDoc.description())
                            }));
                }

                result.append("\n");
            }

            final CodeDoc[] codeDocs = method.getAnnotationsByType(CodeDoc.class);
            if (codeDocs.length > 0) {
                result.append("#### Response Codes\n\n")
                        .append(new MarkdownTable("HTTP Code", "Reason")
                                .addRows(codeDocs, codeDoc -> new String[]{
                                        codeDoc.code().toString(),
                                        replaceMarkdownReferences(codeDoc.reason())
                                }));
            }

            result.append("\n");
        }

        result.deleteCharAt(result.length() - 1);

        try (final FileWriter writer = new FileWriter("README.md")) {
            writer.write(BASE_DOCS + result);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String parseClassType(Class<?> type) {
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

    private static String replaceMarkdownReferences(String text) {
        return LINKS_REGEX.matcher(text).replaceAll(matchResult -> {
            final String structure = matchResult.group(1);
            final String file = matchResult.group(2);
            final String endpoint = matchResult.group(3);
            return structure != null ? "[" + structure.toLowerCase() + "](#" + structure.toLowerCase() + "-object)"
                    : file != null ? "[" + file + "](" + file + ")"
                    : "[" + endpoint + "](#" + ENDPOINT_PATH_TO_LINK.get(endpoint) + ")";
        });
    }

    private static class MarkdownTable {
        private final int columns;
        private final String[] headers;
        private final ArrayList<String[]> values;
        private final int[] lengths;

        public MarkdownTable(String... headers) {
            this.columns = headers.length;
            this.headers = headers;
            this.values = new ArrayList<>();
            this.lengths = new int[headers.length];

            for (int i = 0; i < headers.length; i++) {
                lengths[i] = headers[i].length();
            }
        }

        public <T> MarkdownTable addRows(T[] array, Function<T, String[]> mapper) {
            for (final T row : array) {
                this.addRow(mapper.apply(row));
            }
            return this;
        }

        public void addRow(String... values) {
            if (values.length != this.columns) {
                throw new IllegalArgumentException("Number of values does not match number of columns");
            }

            this.values.add(values);

            for (int i = 0; i < this.columns; i++) {
                final int length = values[i].length();
                if (length > this.lengths[i]) {
                    this.lengths[i] = length;
                }
            }
        }

        @Override
        public String toString() {
            final StringBuilder tableString = new StringBuilder("|");

            for (int i = 0; i < this.columns; i++) {
                tableString.append(" ")
                        .append(Strings.padEnd(this.headers[i], this.lengths[i], ' '))
                        .append(" |");
            }

            tableString.append("\n|");

            for (int i = 0; i < this.columns; i++) {
                tableString.append("-".repeat(this.lengths[i] + 2))
                        .append("|");
            }

            tableString.append("\n");

            for (final String[] row : values) {
                tableString.append("|");

                for (int i = 0; i < this.columns; i++) {
                    tableString.append(" ")
                            .append(Strings.padEnd(row[i], this.lengths[i], ' '))
                            .append(" |");
                }

                tableString.append("\n");
            }

            return tableString.toString();
        }
    }
}
