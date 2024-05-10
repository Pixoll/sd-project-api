"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendNoContent = exports.sendCreated = exports.sendOk = exports.HTTPCode = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFtQkEsSUFBWSxRQVVYO0FBVkQsV0FBWSxRQUFRO0lBQ2hCLHFDQUFRLENBQUE7SUFDUiwrQ0FBYSxDQUFBO0lBQ2IsbURBQWUsQ0FBQTtJQUNmLHFEQUFnQixDQUFBO0lBQ2hCLHlEQUFrQixDQUFBO0lBQ2xCLGlEQUFjLENBQUE7SUFDZCxpREFBYyxDQUFBO0lBQ2QsK0RBQXFCLENBQUE7SUFDckIsdURBQWlCLENBQUE7QUFDckIsQ0FBQyxFQVZXLFFBQVEsd0JBQVIsUUFBUSxRQVVuQjtBQUVELFNBQWdCLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQWM7SUFDckQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCx3QkFFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUFrQjtJQUMxQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsUUFBa0I7SUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsQ0FBQztBQUZELHNDQUVDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLFFBQWtCLEVBQUUsSUFBYyxFQUFFLE9BQWU7SUFDekUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDhCQUVDIn0=