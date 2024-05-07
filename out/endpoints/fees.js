"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.fees = void 0;
const fs_1 = require("fs");
const base_1 = require("./base");
const path_1 = __importDefault(require("path"));
exports.fees = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "../../../static/fees.json"), "utf8"));
exports.methods = {
    get(_, response) {
        (0, base_1.sendOk)(response, exports.fees);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvZmVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQkFBa0M7QUFDbEMsaUNBQXlDO0FBQ3pDLGdEQUF3QjtBQUVYLFFBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxpQkFBWSxFQUN2QyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQyxFQUNqRCxNQUFNLENBQ1QsQ0FJRyxDQUFDO0FBRVEsUUFBQSxPQUFPLEdBQUc7SUFDbkIsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRO1FBQ1gsSUFBQSxhQUFNLEVBQUMsUUFBUSxFQUFFLFlBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDYyxDQUFDIn0=