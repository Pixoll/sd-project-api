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

## Base URL

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


## Endpoints

### Get Fees

Get a list of all applicable fees.

#### URL

```
GET /fees
```

#### Response Body

Contents of [/static/fees.json](/static/fees.json).

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the fees list. |

### Login User

Verify user login credentials.

#### URL

```
POST /login
```

#### Request Body

| Field | Type | Description |
| --- | --- | --- |
| email | string | The user's email. |
| password | string | The user's password. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully logged in. |
| 400 Bad Request | Malformed request. |
| 401 Unauthorized | Wrong password. |
| 404 Not Found | User with that `email` does not exist. |

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

### Get Regions

Get a list of all regions in the country alongside all their communes.

#### URL

```
GET /regions
```

#### Response Body

Contents of [/static/regions_communes.json](/static/regions_communes.json).

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the regions list. |

### Create Shipment

Create a new [shipment](#shipment-object). `id` may not be specified in the request.

#### URL

```
POST /shipments
```

#### Request Body

A [shipment](#shipment-object) object without the `id`.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 Created | Successfully created new shipment. |
| 400 Bad Request | Malformed shipment structure. |

### Get User

Returns a [user](#user-object) for the given `rut`, `email` or `phone` number.

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

A [user](#user-object) object without the `password` or `salt` field.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the user. |
| 400 Bad Request | Provided more than one kind of parameter. |
| 404 Not Found | No user exists with the provided query. |

### Create User

Create a new [user](#user-object). Only one user per `rut`, `email` or `phone` number may exist at one time. `salt` may not be specified in the request.

#### URL

```
POST /users
```

#### Request Body

A [user](#user-object) object without the `salt`.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 Created | Successfully created new user. |
| 400 Bad Request | Malformed user structure. |
| 409 Conflict | A user with that `rut`, `email` or `phone` number already exists. |

### Delete User

Delete the [user](#user-object) matching the provided `rut`.

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
