"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.regions = void 0;
const base_1 = require("./base");
const regions_communes_json_1 = __importDefault(require("../../static/regions_communes.json"));
exports.regions = regions_communes_json_1.default;
exports.methods = {
    get(_, response) {
        (0, base_1.sendOk)(response, exports.regions);
        return;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvcmVnaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBaUQ7QUFFakQsK0ZBQTBEO0FBRTdDLFFBQUEsT0FBTyxHQUFHLCtCQUE4QyxDQUFDO0FBRXpELFFBQUEsT0FBTyxHQUFHO0lBT25CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUTtRQUNYLElBQUEsYUFBTSxFQUFDLFFBQVEsRUFBRSxlQUFPLENBQUMsQ0FBQztRQUMxQixPQUFPO0lBQ1gsQ0FBQztDQUNzQixDQUFDIn0=