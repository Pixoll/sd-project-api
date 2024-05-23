"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesEndpoint = void 0;
const base_1 = require("./base");
const fees_json_1 = __importDefault(require("../../static/fees.json"));
class FeesEndpoint extends base_1.Endpoint {
    static fees = fees_json_1.default;
    constructor() {
        super("/fees");
    }
    get(_, response) {
        base_1.Endpoint.sendOk(response, fees_json_1.default);
    }
}
exports.FeesEndpoint = FeesEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvZmVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBa0M7QUFFbEMsdUVBQTBDO0FBRTFDLE1BQWEsWUFBYSxTQUFRLGVBQVE7SUFDL0IsTUFBTSxDQUFVLElBQUksR0FBRyxtQkFBMkMsQ0FBQztJQUUxRTtRQUNJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBUU0sR0FBRyxDQUFDLENBQW1CLEVBQUUsUUFBd0M7UUFDcEUsZUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsbUJBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7O0FBZkwsb0NBZ0JDIn0=