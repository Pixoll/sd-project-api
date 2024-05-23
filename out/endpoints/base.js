"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
const tokens_1 = require("../tokens");
const util_1 = require("../util");
class Endpoint {
    path;
    constructor(path) {
        this.path = path;
        this.path = path[0] === "/" ? path : "/" + path;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBeUM7QUFDekMsa0NBQStCO0FBRS9CLE1BQXNCLFFBQVE7SUFDUztJQUFuQyxZQUFtQyxJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUMzQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFpQixFQUFFLFFBQW1CLEVBQUUsSUFBa0I7UUFDbkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFnQixDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekYsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssa0JBQWtCLEVBQUUsQ0FBQztZQUM5RSxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxpREFBaUQsQ0FBQyxDQUFDO1lBQzlHLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRVMsTUFBTSxDQUFDLE1BQU0sQ0FDbkIsUUFBVyxFQUNYLEdBQUcsQ0FBQyxJQUFJLENBQWtFO1FBRTFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVTLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBbUI7UUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFUyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQW1CO1FBQzlDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRVMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFtQixFQUFFLElBQXVCLEVBQUUsT0FBZTtRQUNwRixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRVMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQWlCO1FBQ2hELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFeEIsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQW9DLEVBQUUsQ0FBQztZQUN0RSxNQUFNLEdBQUcsR0FBRyxxQkFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEQsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDTixPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBbERELDRCQWtEQztBQUVELFdBQWlCLFFBQVE7SUFDckIsSUFBWSxRQVNYO0lBVEQsV0FBWSxRQUFRO1FBQ2hCLHFDQUFRLENBQUE7UUFDUiwrQ0FBYSxDQUFBO1FBQ2IsbURBQWUsQ0FBQTtRQUNmLHFEQUFnQixDQUFBO1FBQ2hCLHlEQUFrQixDQUFBO1FBQ2xCLGlEQUFjLENBQUE7UUFDZCxpREFBYyxDQUFBO1FBQ2QsK0RBQXFCLENBQUE7SUFDekIsQ0FBQyxFQVRXLFFBQVEsR0FBUixpQkFBUSxLQUFSLGlCQUFRLFFBU25CO0FBZ0NMLENBQUMsRUExQ2dCLFFBQVEsd0JBQVIsUUFBUSxRQTBDeEIifQ==