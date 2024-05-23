"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
const tokens_1 = require("../tokens");
const util_1 = require("../util");
const registry_1 = require("./registry");
class Endpoint {
    path;
    constructor(path) {
        this.path = path;
        this.path = path[0] === "/" ? path : "/" + path;
        registry_1.EndpointRegistry.registerEndpoint(this);
    }
    static baseMiddleware(request, response, next) {
        const now = new Date().toISOString().replace(/T|\.\d{3}Z$/g, " ").trim();
        const method = request.method;
        console.log(`[${now}] ${method} ${request.path}`, util_1.Util.pick(request, ["query", "body"]));
        if (method === "POST" && request.headers["content-type"] !== "application/json") {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }
        next();
    }
    static sendOk(response, ...[data]) {
        response.status(Endpoint.HTTPCode.Ok).send(data);
    }
    static sendCreated(response) {
        response.status(Endpoint.HTTPCode.Created).send();
    }
    static sendNoContent(response) {
        response.status(Endpoint.HTTPCode.NoContent).send();
    }
    static sendError(response, code, message) {
        response.status(code).send({ status: code, message });
    }
    static getAuthorizedUser(request) {
        const token = request.headers.authorization;
        if (!token)
            return null;
        for (const type of ["admin", "user"]) {
            const rut = tokens_1.TokenManager.getRutFromToken(type, token);
            if (rut) {
                return { type, rut };
            }
        }
        return null;
    }
}
exports.Endpoint = Endpoint;
(function (Endpoint) {
    let HTTPCode;
    (function (HTTPCode) {
        HTTPCode[HTTPCode["Ok"] = 200] = "Ok";
        HTTPCode[HTTPCode["Created"] = 201] = "Created";
        HTTPCode[HTTPCode["NoContent"] = 204] = "NoContent";
        HTTPCode[HTTPCode["BadRequest"] = 400] = "BadRequest";
        HTTPCode[HTTPCode["Unauthorized"] = 401] = "Unauthorized";
        HTTPCode[HTTPCode["NotFound"] = 404] = "NotFound";
        HTTPCode[HTTPCode["Conflict"] = 409] = "Conflict";
        HTTPCode[HTTPCode["ContentTooLarge"] = 413] = "ContentTooLarge";
    })(HTTPCode = Endpoint.HTTPCode || (Endpoint.HTTPCode = {}));
})(Endpoint || (exports.Endpoint = Endpoint = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBeUM7QUFDekMsa0NBQStCO0FBQy9CLHlDQUE4QztBQUU5QyxNQUFzQixRQUFRO0lBQ1M7SUFBbkMsWUFBbUMsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFaEQsMkJBQWdCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBaUIsRUFBRSxRQUFtQixFQUFFLElBQWtCO1FBQ25GLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBZ0IsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpGLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFLENBQUM7WUFDOUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsaURBQWlELENBQUMsQ0FBQztZQUM5RyxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVTLE1BQU0sQ0FBQyxNQUFNLENBQ25CLFFBQVcsRUFDWCxHQUFHLENBQUMsSUFBSSxDQUFrRTtRQUUxRSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFUyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQW1CO1FBQzVDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRVMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFtQjtRQUM5QyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVTLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBbUIsRUFBRSxJQUF1QixFQUFFLE9BQWU7UUFDcEYsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVTLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFpQjtRQUNoRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXhCLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFvQyxFQUFFLENBQUM7WUFDdEUsTUFBTSxHQUFHLEdBQUcscUJBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RELElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ04sT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXBERCw0QkFvREM7QUFFRCxXQUFpQixRQUFRO0lBQ3JCLElBQVksUUFTWDtJQVRELFdBQVksUUFBUTtRQUNoQixxQ0FBUSxDQUFBO1FBQ1IsK0NBQWEsQ0FBQTtRQUNiLG1EQUFlLENBQUE7UUFDZixxREFBZ0IsQ0FBQTtRQUNoQix5REFBa0IsQ0FBQTtRQUNsQixpREFBYyxDQUFBO1FBQ2QsaURBQWMsQ0FBQTtRQUNkLCtEQUFxQixDQUFBO0lBQ3pCLENBQUMsRUFUVyxRQUFRLEdBQVIsaUJBQVEsS0FBUixpQkFBUSxRQVNuQjtBQWdDTCxDQUFDLEVBMUNnQixRQUFRLHdCQUFSLFFBQVEsUUEwQ3hCIn0=