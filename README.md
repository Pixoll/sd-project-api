# Software Design Class Project API

Basic API for software design class project.

## Requirements

- Node.js v16 or later.
- npm v8 or later.
- `.env` file in the root directory with the `MONGO_URI` for your database, and optionally a `PORT` for the API to attach to (default: 3000).

## Executing

- Run `npm i` to install dependencies.
- Run `npm start` to start the API.

# API Reference

This API uses the REST style for its endpoints and methods.

#### Base URL

```
http://localhost:PORT/api/v1
```

## Error Messages

Error messages are given in a JSON format with both the `code` and a human readable `message` describing the problem.

```json
{
    "code": 404,
    "message": "User does not exist."
}
```

## Resources Structure

### Nullable and Optional Resource Fields

Resource fields that may contain a null value have types that are prefixed with a question mark. Resource fields that are optional have names that are suffixed with a question mark.

| Field | Type |
| --- | --- |
| optional_field? | string |
| nullable_field | ?string |
| optional_and_nullable_field? | ?string |

### User Object

| Field | Type | Description |
| --- | --- | --- |
| rut | string | The user's RUT. |
| first_name | string | The user's first name. |
| second_name? | ?string | The user's second name. |
| first_last_name | string | The user's first last name. |
| second_last_name | string | The user's second last name. |
| email | string | The user's email address. |
| phone | number | The user's phone number. |
| address_city | string | The user's city address. |
| address_street | string | The user's street address. |
| address_number | number | The user's street number address. |
| address_secondary? | ?string | The user's apartment or building address. |
| password | string | The user's password. |

## Endpoints

### Send Ping

Check if the API is available.

#### URL

```
GET /ping
```

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | API is available. |

### Get User

Returns a [User](#user-object) for the given `rut`, `email` or `phone` number.

#### URL

```
GET /users
```

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| rut | number | RUT of the user. `email` and `phone` cannot be present if this parameter is. |
| email | string | Email of the user. `rut` and `phone` cannot be present if this parameter is. |
| phone | number | Phone number of the user. `rut` and `email` cannot be present if this parameter is. |

#### Response Body

A [User](#user-object) object without the hashed password.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the user. |
| 400 Bad Request | Provided more than one kind of parameter. |
| 404 Not Found | No user exists with the provided query. |

### Create User

Create a new [User](#user-object). Only one user per `rut`, `email` or `phone` number may exist at one time.

#### URL

```
POST /users
```

#### Request Body

A [User](#user-object) object.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 Created | Successfully created new user. |
| 400 Bad Request | Malformed user structure. |
| 409 Conflict | A user with that `rut`, `email` or `phone` number already exists. |

### Delete User

Delete the [User](#user-object) matching the provided `rut`.

#### URL

```
DELETE /users
```

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| rut | string | RUT of the user. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 204 No Content | Successfully deleted the user. |
| 400 Bad Request | Malformed `rut`. |
| 404 Not Found | User with that `rut` does not exist. |
