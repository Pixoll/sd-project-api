# Software Design Class Project API

Basic API for software design class project.

## Requirements

- Java 17 or later.
- `.env` file in the root directory with the `MONGO_URI` and `MONGO_DB_NAME` for your database, and optionally a `PORT` for the API to attach to (default: 3000).

## Executing

- Download Maven dependencies from `pom.xml`.
- Start the API from `org.sdproject.api.Api.java`.

# API Reference

This API uses the REST style for its endpoints and methods.

## Base URL

```
http://localhost:PORT/api/v1
```

## Error Messages

Error messages are given in a JSON format with both the `code` and a human-readable `message` describing the problem.

```json
{
    "message": "User does not exist.",
    "code": 404
}
```

## Resources Structure

### Resource Field Types

- Resource fields that may contain a null value have types that are prefixed with a question mark.
- Resource fields that are optional have names that are suffixed with a question mark.
- Resource fields that are readonly (i.e. will be ignored in PATCH or PUT requests) are _italicized_.
- Resource fields that are generated (i.e. will be ignored in POST requests) are **bolded**.

| Field                              | Type             |
|------------------------------------|------------------|
| optional_field?                    | string           |
| nullable_field                     | ?integer         |
| optional_and_nullable_field?       | ?float           |
| _readonly_field_                   | boolean          |
| **generated_field**                | object           |
| _**readonly_and_generated_field**_ | array of objects |
