"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const regions_1 = require("../../endpoints/regions");
exports.Schema = new mongoose_1.default.Schema({
    region: {
        type: String,
        cast: false,
        required: true,
        description: "The region.",
        validate: {
            validator: (region) => regions_1.regions.some(r => r.name.toLowerCase() === region.toLowerCase()),
            message: "Invalid region name.",
        },
    },
    city: {
        type: String,
        cast: false,
        required: true,
        description: "The city or commune.",
        validate: {
            validator(commune) {
                return !!regions_1.regions
                    .find(r => r.name.toLowerCase() === this.region.toLowerCase())?.communes
                    .some(c => c.toLowerCase() === commune.toLowerCase());
            },
            message: "Invalid city or commune name.",
        },
    },
    street: {
        type: String,
        cast: false,
        required: true,
        description: "The street name.",
    },
    number: {
        type: Number,
        cast: false,
        required: true,
        description: "The street number.",
        min: 0,
    },
    secondary: {
        type: String,
        cast: false,
        required: false,
        default: null,
        description: "Secondary address information like apartment building.",
    },
}, {
    _id: false,
    versionKey: false,
});
exports.Schema.name = "Address";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL0FkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLHFEQUFrRDtBQUVyQyxRQUFBLE1BQU0sR0FBRyxJQUFJLGtCQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3RDLE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLFdBQVcsRUFBRSxhQUFhO1FBQzFCLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxDQUFDLE1BQWMsRUFBVyxFQUFFLENBQUMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDckQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQ2hEO1lBQ0QsT0FBTyxFQUFFLHNCQUFzQjtTQUNsQztLQUNKO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsV0FBVyxFQUFFLHNCQUFzQjtRQUNuQyxRQUFRLEVBQUU7WUFDTixTQUFTLENBQTJCLE9BQWU7Z0JBQy9DLE9BQU8sQ0FBQyxDQUFDLGlCQUFPO3FCQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLFFBQVE7cUJBQ3ZFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM5RCxDQUFDO1lBQ0QsT0FBTyxFQUFFLCtCQUErQjtTQUMzQztLQUNKO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsV0FBVyxFQUFFLGtCQUFrQjtLQUNsQztJQUNELE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLFdBQVcsRUFBRSxvQkFBb0I7UUFDakMsR0FBRyxFQUFFLENBQUM7S0FDVDtJQUNELFNBQVMsRUFBRTtRQUNQLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLHdEQUF3RDtLQUN4RTtDQUN3QixFQUFFO0lBQzNCLEdBQUcsRUFBRSxLQUFLO0lBQ1YsVUFBVSxFQUFFLEtBQUs7Q0FDcEIsQ0FBQyxDQUFDO0FBR0gsY0FBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMifQ==