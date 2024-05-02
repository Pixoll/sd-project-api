"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Schema extends mongoose_1.default.Schema {
    constructor(definition, options) {
        super(definition, options);
        for (const [key, { description }] of Object.entries(definition)) {
            const def = this.obj[key];
            if (def)
                def.description = description;
        }
    }
}
exports.Schema = Schema;
function model(name, schema, collection, options) {
    return mongoose_1.default.model(name, schema, collection, options);
}
exports.model = model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0RBQWdDO0FBcUJoQyxNQUFhLE1BZ0JYLFNBQVEsa0JBQVEsQ0FBQyxNQVVsQjtJQUlHLFlBQ0ksVUFBbUcsRUFDbkcsT0FPaUQ7UUFHakQsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUzQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBcUQsQ0FBQyxFQUFFLENBQUM7WUFDekcsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLEdBQUc7Z0JBQUUsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQWpERCx3QkFpREM7QUFFRCxTQUFnQixLQUFLLENBQ2pCLElBQVksRUFDWixNQUFnQixFQUNoQixVQUFtQixFQUNuQixPQUFzQztJQWN0QyxPQUFPLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFuQkQsc0JBbUJDIn0=