"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fees_1 = require("../endpoints/fees");
class Package extends null {
    static types = fees_1.FeesEndpoint.fees.package_type.map(p => p.id);
    static typesList = Package.types.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");
    static Schema = new mongoose_1.default.Schema({
        type: {
            type: String,
            enum: Package.types,
            required: true,
            cast: false,
            description: `Type of the package. One of: ${Package.typesList}.`,
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
    static {
        Object.assign(Package.Schema, {
            name: Package.name,
        });
    }
}
exports.Package = Package;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3BhY2thZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLDRDQUFpRDtBQUVqRCxNQUFhLE9BQVEsU0FBUSxJQUFJO0lBQ3JCLE1BQU0sQ0FBVSxLQUFLLEdBQUcsbUJBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQVUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTNHLE1BQU0sQ0FBVSxNQUFNLEdBQUcsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FBZTtRQUM5RCxJQUFJLEVBQUU7WUFDRixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSztZQUNuQixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLGdDQUFnQyxPQUFPLENBQUMsU0FBUyxHQUFHO1NBQ3BFO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLGlEQUFpRDtTQUNqRTtRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsS0FBSztZQUNYLEdBQUcsRUFBRSxDQUFDO1lBQ04sV0FBVyxFQUFFLDhCQUE4QjtTQUM5QztRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsS0FBSztZQUNYLEdBQUcsRUFBRSxDQUFDO1lBQ04sV0FBVyxFQUFFLDZCQUE2QjtTQUM3QztRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsS0FBSztZQUNYLEdBQUcsRUFBRSxDQUFDO1lBQ04sV0FBVyxFQUFFLDhCQUE4QjtTQUM5QztRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsS0FBSztZQUNYLEdBQUcsRUFBRSxDQUFDO1lBQ04sV0FBVyxFQUFFLDhCQUE4QjtTQUM5QztLQUN3QixFQUFFO1FBQzNCLEdBQUcsRUFBRSxLQUFLO1FBQ1YsVUFBVSxFQUFFLEtBQUs7S0FDcEIsQ0FBQyxDQUFDO0lBRUg7UUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1NBQ3JCLENBQUMsQ0FBQztJQUNQLENBQUM7O0FBdkRMLDBCQXdEQyJ9