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

### Address Object

| Field     | Type    | Description                                    |
|-----------|---------|------------------------------------------------|
| region    | string  | The region.                                    |
| city      | string  | The city or commune.                           |
| street    | string  | The street name.                               |
| number    | integer | The street number.                             |
| secondary | ?string | Secondary information like apartment building. |

### Admin Object

| Field                   | Type                                                         | Description                        |
|-------------------------|--------------------------------------------------------------|------------------------------------|
| _rut_                   | string                                                       | The admin's RUT.                   |
| first_name              | string                                                       | The admin's first name.            |
| second_name             | ?string                                                      | The admin's second name.           |
| first_last_name         | string                                                       | The admin's first last name.       |
| second_last_name        | ?string                                                      | The admin's second last name.      |
| email                   | string                                                       | The admin's email address.         |
| phone                   | integer                                                      | The admin's phone number.          |
| password                | string                                                       | The admin's password.              |
| _**salt**_              | string                                                       | The admin's salt for the password. |
| _**created_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created.       |
| _**updated_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was last updated.  |

### Package Object

Fields in this structure cannot be updated at all.

| Field       | Type   | Description                                           |
|-------------|--------|-------------------------------------------------------|
| type        | string | Type of the package. One of: `document` or `package`. |
| description | string | Brief description of what the package contains.       |
| length      | float  | Length of the package in mm.                          |
| width       | float  | Width of the package in mm.                           |
| height      | float  | Height of the package in mm.                          |
| weight      | float  | Weight of the package in kg.                          |

### Shipment Object

| Field                   | Type                                                         | Description                                                        |
|-------------------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| _**id**_                | string                                                       | The shipment id. Used for tracking.                                |
| _rut_sender_            | string                                                       | RUT of the sender. Must be of an existing [user](#user-object).    |
| rut_recipient           | string                                                       | RUT of the recipient. Must be of an existing [user](#user-object). |
| _source_address_        | [address](#address-object) object                            | Address where the packages are being shipped from.                 |
| _destination_address_   | [address](#address-object) object                            | Address where the packages are being shipped to.                   |
| dispatch_timestamp      | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the shipment was picked up from the source address.           |
| delivery_timestamp      | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the shipment arrived to the destination address.              |
| **status_history**      | array of [status history](#status-history-object) objects    | Status history of the shipment.                                    |
| _shipping_type_         | string                                                       | Type of the shipping. One of: `same_day`, `fast` or `regular`.     |
| _pending_payment_       | boolean                                                      | Whether the shipment is going to be paid by the recipient or not.  |
| _home_pickup_           | boolean                                                      | Whether the packages are being picked up at the sender's address.  |
| _home_delivery_         | boolean                                                      | Whether the packages are being shipped to the recipient's address. |
| _packages_              | array of [package](#package-object) objects                  | All the packages being shipped.                                    |
| _**created_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created.                                       |
| _**updated_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was last updated.                                  |

### Status History Object

Fields in this structure cannot be updated at all.

| Field     | Type                                                         | Description                                                                                                |
|-----------|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| status    | string                                                       | Status of the shipment. One of: `pending`, `pre-transit`, `in_transit`, `out_for_delivery` or `delivered`. |
| timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | Time when the status was recorded/changed to.                                                              |

### User Object

| Field                   | Type                                                         | Description                                          |
|-------------------------|--------------------------------------------------------------|------------------------------------------------------|
| _rut_                   | string                                                       | The user's RUT.                                      |
| first_name              | string                                                       | The user's first name.                               |
| second_name             | ?string                                                      | The user's second name.                              |
| first_last_name         | string                                                       | The user's first last name.                          |
| second_last_name        | ?string                                                      | The user's second last name.                         |
| email                   | string                                                       | The user's email address.                            |
| phone                   | integer                                                      | The user's phone number.                             |
| address                 | [address](#address-object) object                            | The user's address.                                  |
| password                | string                                                       | The user's password.                                 |
| _**salt**_              | string                                                       | The user's salt for the password.                    |
| _**verified**_          | boolean                                                      | Whether the user has verified their identity or not. |
| _**created_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created.                         |
| _**updated_timestamp**_ | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was last updated.                    |

## Endpoints

### Get Admin

Returns an [admin](#admin-object) for the given `rut`.

#### URL

```
GET /admins
```

#### Request Headers

| Name          | Type   | Description                                                                        |
|---------------|--------|------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in admin. See [POST /admins/session](#login-as-admin). |

#### Request Query Parameters

| Name | Type   | Description       |
|------|--------|-------------------|
| rut  | string | RUT of the admin. |

#### Response Body

An [admin](#admin-object) object without the `password` and `salt` fields.

#### Response Codes

| HTTP Code        | Reason                                   |
|------------------|------------------------------------------|
| 200 OK           | Successfully retrieved the admin.        |
| 400 Bad Request  | Did not provide `rut` or it's malformed. |
| 401 Unauthorized | Not logged in as an admin.               |
| 404 Not Found    | Admin does not exist.                    |

### Login as Admin

Verify admin login credentials.

#### URL

```
POST /admins/session
```

#### Request Body

| Field    | Type   | Description           |
|----------|--------|-----------------------|
| email    | string | The admin's email.    |
| password | string | The admin's password. |

#### Response Body

| Field         | Type   | Description                            |
|---------------|--------|----------------------------------------|
| session_token | string | Session token for the logged in admin. |

#### Response Codes

| HTTP Code        | Reason                  |
|------------------|-------------------------|
| 200 OK           | Successfully logged in. |
| 400 Bad Request  | Malformed request body. |
| 401 Unauthorized | Wrong password.         |
| 404 Not Found    | Admin does not exist.   |

### Logout from Admin Session

Revoke admin session token.

#### URL

```
DELETE /admins/session
```

#### Request Headers

| Name          | Type   | Description                                                                        |
|---------------|--------|------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in admin. See [POST /admins/session](#login-as-admin). |

#### Response Codes

| HTTP Code        | Reason                              |
|------------------|-------------------------------------|
| 204 No Content   | Successfully revoked session token. |
| 401 Unauthorized | Not logged in.                      |

### Get Fees

Get a list of all applicable fees.

#### URL

```
GET /fees
```

#### Response Body

Contents of [/static/fees.json](/static/fees.json).

#### Response Codes

| HTTP Code | Reason                                |
|-----------|---------------------------------------|
| 200 OK    | Successfully retrieved the fees list. |

### Send Ping

Check if the API is available.

#### URL

```
GET /ping
```

#### Response Codes

| HTTP Code | Reason            |
|-----------|-------------------|
| 200 OK    | API is available. |

### Get Regions

Get a list of all regions in the country alongside all their communes.

#### URL

```
GET /regions
```

#### Response Body

Contents of [/static/regions_communes.json](/static/regions_communes.json).

#### Response Codes

| HTTP Code | Reason                                   |
|-----------|------------------------------------------|
| 200 OK    | Successfully retrieved the regions list. |

### Get Shipment

Returns a [shipment](#shipment-object) for the given tracking `id`.

#### URL

```
GET /shipments
```

#### Request Query Parameters

| Name | Type   | Description                 |
|------|--------|-----------------------------|
| id   | string | The shipment's tracking id. |

#### Response Body

A [shipment](#shipment-object) object.

#### Response Codes

| HTTP Code       | Reason                               |
|-----------------|--------------------------------------|
| 200 OK          | Successfully retrieved the shipment. |
| 400 Bad Request | Did not provide tracking `id`.       |
| 404 Not Found   | Shipment does not exist.             |

### Create Shipment

Create a new [shipment](#shipment-object).

#### URL

```
POST /shipments
```

#### Request Headers

| Name          | Type   | Description                                                                                                                          |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in user or admin. See [POST /users/session](#login-as-user) and [POST /admins/session](#login-as-admin). |

#### Request Body

A [shipment](#shipment-object) object without the `id`, `created_timestamp` and `updated_timestamp` fields.

#### Response Codes

| HTTP Code        | Reason                             |
|------------------|------------------------------------|
| 201 Created      | Successfully created new shipment. |
| 400 Bad Request  | Malformed shipment structure.      |
| 401 Unauthorized | Not logged in.                     |

### Delete Shipment

Delete the [shipment](#shipment-object) matching the provided tracking `id`.

#### URL

```
DELETE /shipments
```

#### Request Headers

| Name          | Type   | Description                                                                        |
|---------------|--------|------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in admin. See [POST /admins/session](#login-as-admin). |

#### Request Query Parameters

| Name | Type   | Description                 |
|------|--------|-----------------------------|
| id   | string | The shipment's tracking id. |

#### Response Codes

| HTTP Code        | Reason                             |
|------------------|------------------------------------|
| 204 No Content   | Successfully deleted the shipment. |
| 400 Bad Request  | Did not provide tracking `id`.     |
| 401 Unauthorized | Not logged in as an admin.         |
| 404 Not Found    | Shipment does not exist.           |

### Update Shipment Status

Update the specified [shipment](#shipment-object)'s status. Must follow the same order provided by [status history](#status-history-object).

#### URL

```
POST /shipments/status
```

#### Request Headers

| Name          | Type   | Description                                                                        |
|---------------|--------|------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in admin. See [POST /admins/session](#login-as-admin). |

#### Request Query Parameters

| Name | Type   | Description                 |
|------|--------|-----------------------------|
| id   | string | The shipment's tracking id. |

#### Request Body

| Field      | Type   | Description                                                              |
|------------|--------|--------------------------------------------------------------------------|
| new_status | string | The shipment's new status. See [status history](#status-history-object). |

#### Response Codes

| HTTP Code        | Reason                                                                                     |
|------------------|--------------------------------------------------------------------------------------------|
| 200 OK           | Successfully updated the shipment's status.                                                |
| 400 Bad Request  | Malformed request query or body.                                                           |
| 401 Unauthorized | Not logged in as an admin.                                                                 |
| 404 Not Found    | Shipment does not exist.                                                                   |
| 409 Conflict     | New status does not follow the order provided by [status history](#status-history-object). |

### Get User

Returns a [user](#user-object) for the given `rut`, `email` or `phone` number.

#### URL

```
GET /users
```

#### Request Headers

| Name          | Type   | Description                                                                        |
|---------------|--------|------------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in admin. See [POST /admins/session](#login-as-admin). |

#### Request Query Parameters

| Name  | Type   | Description                                                                         |
|-------|--------|-------------------------------------------------------------------------------------|
| rut   | string | RUT of the user. `email` and `phone` cannot be present if this parameter is.        |
| email | string | Email of the user. `rut` and `phone` cannot be present if this parameter is.        |
| phone | string | Phone number of the user. `rut` and `email` cannot be present if this parameter is. |

#### Response Body

A [user](#user-object) object without the `password` and `salt` fields.

#### Response Codes

| HTTP Code        | Reason                                                                           |
|------------------|----------------------------------------------------------------------------------|
| 200 OK           | Successfully retrieved the user.                                                 |
| 400 Bad Request  | Provided none or more than one kind of parameter, or the parameter is malformed. |
| 401 Unauthorized | Not logged in as an admin.                                                       |
| 404 Not Found    | User does not exist.                                                             |

### Create User

Create a new [user](#user-object). Only one user per `rut`, `email` or `phone` number may exist at one time.

#### URL

```
POST /users
```

#### Request Body

A [user](#user-object) object without the `salt`, `verified`, `created_timestamp` and `updated_timestamp` fields.

#### Response Codes

| HTTP Code       | Reason                                                            |
|-----------------|-------------------------------------------------------------------|
| 201 Created     | Successfully created new user.                                    |
| 400 Bad Request | Malformed user structure.                                         |
| 409 Conflict    | A user with that `rut`, `email` or `phone` number already exists. |

### Delete User

Delete the [user](#user-object)'s account.

#### URL

```
DELETE /users
```

#### Request Headers

| Name          | Type   | Description                                                                     |
|---------------|--------|---------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in user. See [POST /users/session](#login-as-user). |

#### Request Query Parameters

| Name | Type   | Description      |
|------|--------|------------------|
| rut  | string | RUT of the user. |

#### Response Codes

| HTTP Code        | Reason                         |
|------------------|--------------------------------|
| 204 No Content   | Successfully deleted the user. |
| 401 Unauthorized | Not logged in.                 |
| 404 Not Found    | User does not exist.           |

### Get Current User

Returns the information of the current logged-in [user](#user-object).

#### URL

```
GET /users/me
```

#### Request Headers

| Name          | Type   | Description                                                                     |
|---------------|--------|---------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in user. See [POST /users/session](#login-as-user). |

#### Response Body

A [user](#user-object) object without the `password` and `salt` fields.

#### Response Codes

| HTTP Code        | Reason                           |
|------------------|----------------------------------|
| 200 OK           | Successfully retrieved the user. |
| 401 Unauthorized | Not logged in.                   |
| 404 Not Found    | User does not exist.             |

### Login as User

Verify user login credentials.

#### URL

```
POST /users/session
```

#### Request Body

| Field    | Type   | Description          |
|----------|--------|----------------------|
| email    | string | The user's email.    |
| password | string | The user's password. |

#### Response Body

| Field         | Type   | Description                           |
|---------------|--------|---------------------------------------|
| session_token | string | Session token for the logged in user. |

#### Response Codes

| HTTP Code        | Reason                  |
|------------------|-------------------------|
| 200 OK           | Successfully logged in. |
| 400 Bad Request  | Malformed request body. |
| 401 Unauthorized | Wrong password.         |
| 404 Not Found    | User does not exist.    |

### Logout from User Session

Revoke user session token.

#### URL

```
DELETE /users/session
```

#### Request Headers

| Name          | Type   | Description                                                                     |
|---------------|--------|---------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in user. See [POST /users/session](#login-as-user). |

#### Response Codes

| HTTP Code        | Reason                              |
|------------------|-------------------------------------|
| 204 No Content   | Successfully revoked session token. |
| 401 Unauthorized | Not logged in.                      |

### Verify User Identity

Verify a user's ID by reading the QR code at the back of it. Will not process images bigger than 1MB.

#### URL

```
POST /users/verify_id
```

#### Request Headers

| Name          | Type   | Description                                                                     |
|---------------|--------|---------------------------------------------------------------------------------|
| Authorization | string | Session token of the logged-in user. See [POST /users/session](#login-as-user). |

#### Request Query Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| rut  | string | RUT of the user to verify. |

#### Request Body

| Field | Type   | Description                     |
|-------|--------|---------------------------------|
| data  | string | Image encoded in base64 format. |

#### Response Codes

| HTTP Code             | Reason                                     |
|-----------------------|--------------------------------------------|
| 200 OK                | Successfully verified the user's identity. |
| 400 Bad Request       | Malformed request or QR content.           |
| 401 Unauthorized      | Not logged in.                             |
| 404 Not Found         | User does not exist.                       |
| 409 Conflict          | User is already verified.                  |
| 413 Content Too Large | Image is bigger than 1MB.                  |
