"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fees_1 = require("../../endpoints/fees");
const packageTypes = fees_1.FeesEndpoint.fees.package_type.map(p => p.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1BhY2thZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLCtDQUFvRDtBQVdwRCxNQUFNLFlBQVksR0FBRyxtQkFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV6RixRQUFBLE1BQU0sR0FBRyxJQUFJLGtCQUFRLENBQUMsTUFBTSxDQUFPO0lBQzVDLElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFlBQVk7UUFDbEIsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSxnQ0FBZ0MsZ0JBQWdCLEdBQUc7S0FDbkU7SUFDRCxXQUFXLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsaURBQWlEO0tBQ2pFO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsR0FBRyxFQUFFLENBQUM7UUFDTixXQUFXLEVBQUUsOEJBQThCO0tBQzlDO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsR0FBRyxFQUFFLENBQUM7UUFDTixXQUFXLEVBQUUsNkJBQTZCO0tBQzdDO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsR0FBRyxFQUFFLENBQUM7UUFDTixXQUFXLEVBQUUsOEJBQThCO0tBQzlDO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsR0FBRyxFQUFFLENBQUM7UUFDTixXQUFXLEVBQUUsOEJBQThCO0tBQzlDO0NBQ3dCLEVBQUU7SUFDM0IsR0FBRyxFQUFFLEtBQUs7SUFDVixVQUFVLEVBQUUsS0FBSztDQUNwQixDQUFDLENBQUM7QUFHSCxjQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyJ9