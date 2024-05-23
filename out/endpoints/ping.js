"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingEndpoint = void 0;
const base_1 = require("./base");
class PingEndpoint extends base_1.Endpoint {
    constructor() {
        super("/ping");
    }
    get(_, response) {
        base_1.Endpoint.sendOk(response);
    }
}
exports.PingEndpoint = PingEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBa0M7QUFFbEMsTUFBYSxZQUFhLFNBQVEsZUFBUTtJQUN0QztRQUNJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBT00sR0FBRyxDQUFDLENBQW1CLEVBQUUsUUFBMkI7UUFDdkQsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0o7QUFiRCxvQ0FhQyJ9