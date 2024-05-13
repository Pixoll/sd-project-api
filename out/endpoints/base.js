"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDataFromAuth = exports.sendError = exports.sendNoContent = exports.sendCreated = exports.sendOk = exports.baseMiddleware = exports.HTTPCode = void 0;
var HTTPCode;
(function (HTTPCode) {
    HTTPCode[HTTPCode["Ok"] = 200] = "Ok";
    HTTPCode[HTTPCode["Created"] = 201] = "Created";
    HTTPCode[HTTPCode["NoContent"] = 204] = "NoContent";
    HTTPCode[HTTPCode["BadRequest"] = 400] = "BadRequest";
    HTTPCode[HTTPCode["Unauthorized"] = 401] = "Unauthorized";
    HTTPCode[HTTPCode["NotFound"] = 404] = "NotFound";
    HTTPCode[HTTPCode["Conflict"] = 409] = "Conflict";
    HTTPCode[HTTPCode["ContentTooLarge"] = 413] = "ContentTooLarge";
    HTTPCode[HTTPCode["ServerError"] = 500] = "ServerError";
})(HTTPCode || (exports.HTTPCode = HTTPCode = {}));
function baseMiddleware(request, response, next) {
    if (request.method === "POST" && request.headers["content-type"] !== "application/json") {
        sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
        return;
    }
    next();
}
exports.baseMiddleware = baseMiddleware;
function sendOk(response, data) {
    response.status(HTTPCode.Ok).send(data);
}
exports.sendOk = sendOk;
function sendCreated(response) {
    response.status(HTTPCode.Created).send();
}
exports.sendCreated = sendCreated;
function sendNoContent(response) {
    response.status(HTTPCode.NoContent).send();
}
exports.sendNoContent = sendNoContent;
function sendError(response, code, message) {
    response.status(code).send({ status: code, message });
}
exports.sendError = sendError;
function getUserDataFromAuth(request) {
    request.headers.authorization;
    return null;
}
exports.getUserDataFromAuth = getUserDataFromAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFvQkEsSUFBWSxRQVVYO0FBVkQsV0FBWSxRQUFRO0lBQ2hCLHFDQUFRLENBQUE7SUFDUiwrQ0FBYSxDQUFBO0lBQ2IsbURBQWUsQ0FBQTtJQUNmLHFEQUFnQixDQUFBO0lBQ2hCLHlEQUFrQixDQUFBO0lBQ2xCLGlEQUFjLENBQUE7SUFDZCxpREFBYyxDQUFBO0lBQ2QsK0RBQXFCLENBQUE7SUFDckIsdURBQWlCLENBQUE7QUFDckIsQ0FBQyxFQVZXLFFBQVEsd0JBQVIsUUFBUSxRQVVuQjtBQUVELFNBQWdCLGNBQWMsQ0FBQyxPQUFnQixFQUFFLFFBQWtCLEVBQUUsSUFBa0I7SUFDbkYsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFLENBQUM7UUFDdEYsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLGlEQUFpRCxDQUFDLENBQUM7UUFDNUYsT0FBTztJQUNYLENBQUM7SUFFRCxJQUFJLEVBQUUsQ0FBQztBQUNYLENBQUM7QUFQRCx3Q0FPQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQWM7SUFDckQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCx3QkFFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUFrQjtJQUMxQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsUUFBa0I7SUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsQ0FBQztBQUZELHNDQUVDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLFFBQWtCLEVBQUUsSUFBYyxFQUFFLE9BQWU7SUFDekUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDhCQUVDO0FBT0QsU0FBZ0IsbUJBQW1CLENBQUMsT0FBZ0I7SUFDaEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDOUIsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUhELGtEQUdDIn0=