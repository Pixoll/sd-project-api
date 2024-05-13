"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizedUser = exports.sendError = exports.sendNoContent = exports.sendCreated = exports.sendOk = exports.baseMiddleware = exports.HTTPCode = void 0;
const tokens_1 = require("../tokens");
const util_1 = require("../util");
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
    const now = new Date().toISOString().replace(/T|\.\d{3}Z$/g, " ").trim();
    const method = request.method;
    console.log(`[${now}] ${method} ${request.path}`, (0, util_1.pick)(request, ["query", "body"]));
    if (method === "POST" && request.headers["content-type"] !== "application/json") {
        sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
        return;
    }
    next();
}
exports.baseMiddleware = baseMiddleware;
function sendOk(response, ...[data]) {
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
function getAuthorizedUser(request) {
    const token = request.headers.authorization;
    if (!token)
        return null;
    for (const type of ["admin", "user"]) {
        const rut = (0, tokens_1.getRutFromToken)(type, token);
        if (rut) {
            return { type, rut };
        }
    }
    return null;
}
exports.getAuthorizedUser = getAuthorizedUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBdUQ7QUFDdkQsa0NBQStCO0FBc0MvQixJQUFZLFFBVVg7QUFWRCxXQUFZLFFBQVE7SUFDaEIscUNBQVEsQ0FBQTtJQUNSLCtDQUFhLENBQUE7SUFDYixtREFBZSxDQUFBO0lBQ2YscURBQWdCLENBQUE7SUFDaEIseURBQWtCLENBQUE7SUFDbEIsaURBQWMsQ0FBQTtJQUNkLGlEQUFjLENBQUE7SUFDZCwrREFBcUIsQ0FBQTtJQUNyQix1REFBaUIsQ0FBQTtBQUNyQixDQUFDLEVBVlcsUUFBUSx3QkFBUixRQUFRLFFBVW5CO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLE9BQWdCLEVBQUUsUUFBa0IsRUFBRSxJQUFrQjtJQUNuRixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQWdCLENBQUM7SUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUEsV0FBSSxFQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssa0JBQWtCLEVBQUUsQ0FBQztRQUM5RSxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsaURBQWlELENBQUMsQ0FBQztRQUM1RixPQUFPO0lBQ1gsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQVhELHdDQVdDO0FBS0QsU0FBZ0IsTUFBTSxDQUNsQixRQUFXLEVBQ1gsR0FBRyxDQUFDLElBQUksQ0FBa0U7SUFFMUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFMRCx3QkFLQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUFrQjtJQUMxQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsUUFBa0I7SUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsQ0FBQztBQUZELHNDQUVDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLFFBQWtCLEVBQUUsSUFBYyxFQUFFLE9BQWU7SUFDekUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDhCQUVDO0FBT0QsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZ0I7SUFDOUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDNUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQztJQUV4QixLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBdUIsRUFBRSxDQUFDO1FBQ3pELE1BQU0sR0FBRyxHQUFHLElBQUEsd0JBQWUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBWkQsOENBWUMifQ==