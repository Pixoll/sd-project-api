"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.fees = void 0;
const base_1 = require("./base");
const fees_json_1 = __importDefault(require("../../static/fees.json"));
exports.fees = fees_json_1.default;
exports.methods = {
    get(_, response) {
        (0, base_1.sendOk)(response, exports.fees);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvZmVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBaUQ7QUFFakQsdUVBQTJDO0FBRTlCLFFBQUEsSUFBSSxHQUFHLG1CQUF3QyxDQUFDO0FBRWhELFFBQUEsT0FBTyxHQUFHO0lBT25CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUTtRQUNYLElBQUEsYUFBTSxFQUFDLFFBQVEsRUFBRSxZQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBS0gsQ0FBQyJ9