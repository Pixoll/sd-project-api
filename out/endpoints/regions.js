"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.regions = void 0;
const fs_1 = require("fs");
const base_1 = require("./base");
const path_1 = __importDefault(require("path"));
exports.regions = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "../../static/regions_communes.json"), "utf-8"));
exports.methods = {
    get(_, response) {
        (0, base_1.sendOk)(response, exports.regions);
        return;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvcmVnaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQkFBa0M7QUFDbEMsaUNBQXlDO0FBQ3pDLGdEQUF3QjtBQUVYLFFBQUEsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxpQkFBWSxFQUMxQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQ0FBb0MsQ0FBQyxFQUMxRCxPQUFPLENBQ1YsQ0FHQyxDQUFDO0FBRVUsUUFBQSxPQUFPLEdBQUc7SUFPbkIsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRO1FBQ1gsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLGVBQU8sQ0FBQyxDQUFDO1FBQzFCLE9BQU87SUFDWCxDQUFDO0NBQ2MsQ0FBQyJ9