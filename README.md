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

### Base URL

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
