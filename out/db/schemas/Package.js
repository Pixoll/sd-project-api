"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fees_1 = require("../../endpoints/fees");
const packageTypes = fees_1.fees.package_type.map(p => p.id);
const packageTypesList = packageTypes.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");
exports.Schema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: packageTypes,
        required: true,
        cast: false,
        description: `Type of the package. One of: ${packageTypesList}.`,
    },
    description: {
        type: String,
        required: true,
        cast: false,
        description: "Brief description of what the package contains.",
    },
    length: {
        type: Number,
        required: true,
        cast: false,
        min: 0,
        description: "Length of the package in mm.",
    },
    width: {
        type: Number,
        required: true,
        cast: false,
        min: 0,
        description: "Width of the package in mm.",
    },
    height: {
        type: Number,
        required: true,
        cast: false,
        min: 0,
        description: "Height of the package in mm.",
    },
    weight: {
        type: Number,
        required: true,
        cast: false,
        min: 0,
        description: "Weight of the package in kg.",
    },
}, {
    _id: false,
    versionKey: false,
});
exports.Schema.name = "Package";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1BhY2thZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLCtDQUE0QztBQVc1QyxNQUFNLFlBQVksR0FBRyxXQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RCxNQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFekYsUUFBQSxNQUFNLEdBQUcsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FBTztJQUM1QyxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxZQUFZO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsZ0NBQWdDLGdCQUFnQixHQUFHO0tBQ25FO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLGlEQUFpRDtLQUNqRTtJQUNELE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLEdBQUcsRUFBRSxDQUFDO1FBQ04sV0FBVyxFQUFFLDhCQUE4QjtLQUM5QztJQUNELEtBQUssRUFBRTtRQUNILElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLEdBQUcsRUFBRSxDQUFDO1FBQ04sV0FBVyxFQUFFLDZCQUE2QjtLQUM3QztJQUNELE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLEdBQUcsRUFBRSxDQUFDO1FBQ04sV0FBVyxFQUFFLDhCQUE4QjtLQUM5QztJQUNELE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLEdBQUcsRUFBRSxDQUFDO1FBQ04sV0FBVyxFQUFFLDhCQUE4QjtLQUM5QztDQUN3QixFQUFFO0lBQzNCLEdBQUcsRUFBRSxLQUFLO0lBQ1YsVUFBVSxFQUFFLEtBQUs7Q0FDcEIsQ0FBQyxDQUFDO0FBR0gsY0FBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMifQ==