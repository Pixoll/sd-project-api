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
    const method = request.method;
    if (method === "POST" && request.headers["content-type"] !== "application/json") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFnQkEsSUFBWSxRQVVYO0FBVkQsV0FBWSxRQUFRO0lBQ2hCLHFDQUFRLENBQUE7SUFDUiwrQ0FBYSxDQUFBO0lBQ2IsbURBQWUsQ0FBQTtJQUNmLHFEQUFnQixDQUFBO0lBQ2hCLHlEQUFrQixDQUFBO0lBQ2xCLGlEQUFjLENBQUE7SUFDZCxpREFBYyxDQUFBO0lBQ2QsK0RBQXFCLENBQUE7SUFDckIsdURBQWlCLENBQUE7QUFDckIsQ0FBQyxFQVZXLFFBQVEsd0JBQVIsUUFBUSxRQVVuQjtBQUVELFNBQWdCLGNBQWMsQ0FBQyxPQUFnQixFQUFFLFFBQWtCLEVBQUUsSUFBa0I7SUFDbkYsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQWdCLENBQUM7SUFDeEMsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssa0JBQWtCLEVBQUUsQ0FBQztRQUM5RSxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsaURBQWlELENBQUMsQ0FBQztRQUM1RixPQUFPO0lBQ1gsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQVJELHdDQVFDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBYztJQUNyRCxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUZELHdCQUVDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLFFBQWtCO0lBQzFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdDLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxRQUFrQjtJQUM1QyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixTQUFTLENBQUMsUUFBa0IsRUFBRSxJQUFjLEVBQUUsT0FBZTtJQUN6RSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsOEJBRUM7QUFPRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFnQjtJQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUM5QixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBSEQsa0RBR0MifQ==