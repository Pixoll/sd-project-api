"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionsEndpoint = void 0;
const base_1 = require("./base");
const regions_communes_json_1 = __importDefault(require("../../static/regions_communes.json"));
class RegionsEndpoint extends base_1.Endpoint {
    static regions = regions_communes_json_1.default;
    constructor() {
        super("/regions");
    }
    get(_, response) {
        base_1.Endpoint.sendOk(response, regions_communes_json_1.default);
    }
}
exports.RegionsEndpoint = RegionsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvcmVnaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBa0M7QUFFbEMsK0ZBQXlEO0FBRXpELE1BQWEsZUFBZ0IsU0FBUSxlQUFRO0lBQ2xDLE1BQU0sQ0FBVSxPQUFPLEdBQUcsK0JBQWlELENBQUM7SUFFbkY7UUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQVFNLEdBQUcsQ0FBQyxDQUFtQixFQUFFLFFBQTJDO1FBQ3ZFLGVBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLCtCQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDOztBQWZMLDBDQWdCQyJ9