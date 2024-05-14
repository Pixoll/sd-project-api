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

### Address Object

| Field | Type | Description |
| --- | --- | --- |
| region | string | The region. |
| city | string | The city or commune. |
| street | string | The street name. |
| number | number | The street number. |
| secondary | ?string | Secondary address information like apartment building. |

### Admin Object

| Field | Type | Description |
| --- | --- | --- |
| rut | string | The admin's RUT. |
| first_name | string | The admin's first name. |
| second_name | ?string | The admin's second name. |
| first_last_name | string | The admin's first last name. |
| second_last_name | string | The admin's second last name. |
| email | string | The admin's email address. |
| phone | number | The admin's phone number. |
| password | string | The admin's password. |
| salt | string | The admin's salt for the password. |
| created_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created. |
| updated_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was las updated. |

### Package Object

| Field | Type | Description |
| --- | --- | --- |
| type | string | Type of the package. One of: `document` or `package`. |
| description | string | Brief description of what the package contains. |
| length | number | Length of the package in mm. |
| width | number | Width of the package in mm. |
| height | number | Height of the package in mm. |
| weight | number | Weight of the package in kg. |

### Shipment Object

| Field | Type | Description |
| --- | --- | --- |
| id | string | The shipment id. Used for tracking. |
| rut_sender | string | RUT of the sender. Must be of an existing [user](#user-object). |
| rut_recipient | string | RUT of the recipient. Must be of an existing [user](#user-object). |
| source_address | [address](#address-object) object | Address where the packages are being shipped from. |
| destination_address | [address](#address-object) object | Address where the packages are being shipped to. |
| dispatch_timestamp | ?[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the shipment was picked up from the source address. |
| delivery_timestamp | ?[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the shipment arrived to the destination address. |
| status | string | Status of the package. One of: `pending`, `pre-transit`, `in_transit`, `out_for_delivery` or `delivered`. |
| shipping_type | string | Type of the shipment. One of: `same_day`, `fast` or `regular`. |
| pending_payment | boolean | Whether the shipment is going to be paid by the recipient or not. |
| home_pickup | boolean | Whether the packages are being picked up at the sender's address. |
| home_delivery | boolean | Whether the packages are being shipped to the recipient's address. |
| packages | array of [package](#package-object) objects | All the packages being shipped. |
| created_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created. |
| updated_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was las updated. |

### User Object

| Field | Type | Description |
| --- | --- | --- |
| rut | string | The user's RUT. |
| first_name | string | The user's first name. |
| second_name | ?string | The user's second name. |
| first_last_name | string | The user's first last name. |
| second_last_name | string | The user's second last name. |
| email | string | The user's email address. |
| phone | number | The user's phone number. |
| address | [address](#address-object) object | The user's address. |
| password | string | The user's password. |
| salt | string | The user's salt for the password. |
| verified | boolean | Whether the user has verified their identity or not. |
| created_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was created. |
| updated_timestamp | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp | When the object was las updated. |

## Endpoints

### Get Admin

**Only usable while logged in as an admin.** Returns an [admin](#admin-object) for the given `rut`.

#### URL

```
GET /admins
```

#### Request Headers

| Name | Type | Description |
| --- | --- | --- |
| Authorization | string | Session token of the logged in admin. See [/admins/login](#login-as-admin). |

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| rut | number | RUT of the admin. |

#### Response Body

An [admin](#admin-object) object without the `password` and `salt` fields.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the admin. |
| 400 Bad Request | Did not provide `rut` or it's malformed. |
| 404 Not Found | No admin exists with that `rut`. |

### Login as Admin

Verify admin login credentials.

#### URL

```
POST /admins/login
```

#### Request Body

| Field | Type | Description |
| --- | --- | --- |
| email | string | The admin's email. |
| password | string | The admin's password. |

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| session_token | string | Session token for the logged in admin. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully logged in. |
| 400 Bad Request | Malformed request. |
| 401 Unauthorized | Wrong password. |
| 404 Not Found | Admin with that `email` does not exist. |

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

### Get Shipment

Returns a [shipment](#shipment-object) for the given tracking `id`.

#### URL

```
GET /shipments
```

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| id | string | The shipment's tracking id. |

#### Response Body

A [shipment](#shipment-object) object.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the shipment. |
| 400 Bad Request | Did not provide tracking `id`. |
| 404 Not Found | Shipment with that tracking `id` does not exist. |

### Create Shipment

**Only usable while logged in.** Create a new [shipment](#shipment-object).

#### URL

```
POST /shipments
```

#### Request Headers

| Name | Type | Description |
| --- | --- | --- |
| Authorization | string | Session token of the logged in user or admin. See [/users/login](#login-as-user) and [/admins/login](#login-as-admin). |

#### Request Body

A [shipment](#shipment-object) object without the `id`, `created_timestamp` and `updated_timestamp` fields.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 Created | Successfully created new shipment. |
| 400 Bad Request | Malformed shipment structure. |
| 401 Unauthorized | Not logged in. |

### Delete Shipment

**Only usable while logged in as an admin.** Delete the [shipment](#shipment-object) matching the provided tracking `id`.

#### URL

```
DELETE /shipments
```

#### Request Headers

| Name | Type | Description |
| --- | --- | --- |
| Authorization | string | Session token of the logged in admin. See [/admins/login](#login-as-admin). |

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| id | string | The shipment's tracking id. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 204 No Content | Successfully deleted the shipment. |
| 400 Bad Request | Did not provide tracking `id`. |
| 401 Unauthorized | Not an admin. |
| 404 Not Found | Shipment with that tracking `id` does not exist. |

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

A [user](#user-object) object without the `password` and `salt` fields.

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully retrieved the user. |
| 400 Bad Request | Provided none or more than one kind of parameter, or the parameter is malformed. |
| 404 Not Found | No user exists with the provided query. |

### Create User

Create a new [user](#user-object). Only one user per `rut`, `email` or `phone` number may exist at one time.

#### URL

```
POST /users
```

#### Request Body

A [user](#user-object) object without the `salt`, `verified`, `created_timestamp` and `updated_timestamp` fields.

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
| 400 Bad Request | Did not provide `rut`, or malformed `rut`. |
| 404 Not Found | User with that `rut` does not exist. |

### Login as User

Verify user login credentials.

#### URL

```
POST /users/login
```

#### Request Body

| Field | Type | Description |
| --- | --- | --- |
| email | string | The user's email. |
| password | string | The user's password. |

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| session_token | string | Session token for the logged in user. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully logged in. |
| 400 Bad Request | Malformed request. |
| 401 Unauthorized | Wrong password. |
| 404 Not Found | User with that `email` does not exist. |

### Verify User Identity

Verify a user's ID by reading the QR code at the back of it. Will not process images bigger than 1MB.

#### URL

```
POST /users/verify_id
```

#### Request Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| rut | string | RUT of the user to verify. |

#### Request Body

| Field | Type | Description |
| --- | --- | --- |
| data | string | Image encoded in base64 format. |

#### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 OK | Successfully verified the user's identity. |
| 400 Bad Request | Malformed request or QR content. |
| 404 Not Found | User with that `rut` does not exist. |
| 409 Conflict | User is already verified. |
| 413 Content Too Large | Image is bigger than 1MB. |
