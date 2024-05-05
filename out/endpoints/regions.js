"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
const fs_1 = require("fs");
const base_1 = require("./base");
const path_1 = __importDefault(require("path"));
exports.methods = {
    get(_, response) {
        (0, base_1.sendOk)(response, JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "../../static/regions_communes.json"), "utf-8")));
        return;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvcmVnaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQkFBa0M7QUFDbEMsaUNBQXlDO0FBQ3pDLGdEQUF3QjtBQUVYLFFBQUEsT0FBTyxHQUFHO0lBTW5CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUTtRQUNYLElBQUEsYUFBTSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsaUJBQVksRUFDcEMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUMsRUFDMUQsT0FBTyxDQUNWLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTztJQUNYLENBQUM7Q0FDYyxDQUFDIn0=