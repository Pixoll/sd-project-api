"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizedUser = exports.sendError = exports.sendNoContent = exports.sendCreated = exports.sendOk = exports.baseMiddleware = exports.HTTPCode = void 0;
const tokens_1 = require("../tokens");
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
    console.log(request.params);
    const method = request.method;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBdUQ7QUFzQ3ZELElBQVksUUFVWDtBQVZELFdBQVksUUFBUTtJQUNoQixxQ0FBUSxDQUFBO0lBQ1IsK0NBQWEsQ0FBQTtJQUNiLG1EQUFlLENBQUE7SUFDZixxREFBZ0IsQ0FBQTtJQUNoQix5REFBa0IsQ0FBQTtJQUNsQixpREFBYyxDQUFBO0lBQ2QsaURBQWMsQ0FBQTtJQUNkLCtEQUFxQixDQUFBO0lBQ3JCLHVEQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFWVyxRQUFRLHdCQUFSLFFBQVEsUUFVbkI7QUFFRCxTQUFnQixjQUFjLENBQUMsT0FBZ0IsRUFBRSxRQUFrQixFQUFFLElBQWtCO0lBQ25GLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFnQixDQUFDO0lBQ3hDLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFLENBQUM7UUFDOUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLGlEQUFpRCxDQUFDLENBQUM7UUFDNUYsT0FBTztJQUNYLENBQUM7SUFFRCxJQUFJLEVBQUUsQ0FBQztBQUNYLENBQUM7QUFURCx3Q0FTQztBQUtELFNBQWdCLE1BQU0sQ0FDbEIsUUFBVyxFQUNYLEdBQUcsQ0FBQyxJQUFJLENBQWtFO0lBRTFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBTEQsd0JBS0M7QUFFRCxTQUFnQixXQUFXLENBQUMsUUFBa0I7SUFDMUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0MsQ0FBQztBQUZELGtDQUVDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLFFBQWtCO0lBQzVDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxRQUFrQixFQUFFLElBQWMsRUFBRSxPQUFlO0lBQ3pFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCw4QkFFQztBQU9ELFNBQWdCLGlCQUFpQixDQUFDLE9BQWdCO0lBQzlDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQzVDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFeEIsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQXVCLEVBQUUsQ0FBQztRQUN6RCxNQUFNLEdBQUcsR0FBRyxJQUFBLHdCQUFlLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDTixPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQVpELDhDQVlDIn0=