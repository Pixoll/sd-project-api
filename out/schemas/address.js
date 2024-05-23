"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const regions_1 = require("../endpoints/regions");
class Address extends null {
    static Schema = new mongoose_1.default.Schema({
        region: {
            type: String,
            cast: false,
            required: true,
            description: "The region.",
            validate: {
                validator: (region) => regions_1.RegionsEndpoint.regions.some(r => r.name.toLowerCase() === region.toLowerCase()),
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
                    return !!regions_1.RegionsEndpoint.regions
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
    static {
        Object.assign(Address.Schema, {
            name: Address.name,
        });
    }
}
exports.Address = Address;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2FkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLGtEQUF1RDtBQUV2RCxNQUFhLE9BQVEsU0FBUSxJQUFJO0lBQ3RCLE1BQU0sQ0FBVSxNQUFNLEdBQUcsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FBZTtRQUM5RCxNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLElBQUk7WUFDZCxXQUFXLEVBQUUsYUFBYTtZQUMxQixRQUFRLEVBQUU7Z0JBQ04sU0FBUyxFQUFFLENBQUMsTUFBYyxFQUFXLEVBQUUsQ0FBQyx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDckUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQ2hEO2dCQUNELE9BQU8sRUFBRSxzQkFBc0I7YUFDbEM7U0FDSjtRQUNELElBQUksRUFBRTtZQUNGLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsUUFBUSxFQUFFO2dCQUNOLFNBQVMsQ0FBMkIsT0FBZTtvQkFDL0MsT0FBTyxDQUFDLENBQUMseUJBQWUsQ0FBQyxPQUFPO3lCQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRO3lCQUN2RSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQzlELENBQUM7Z0JBQ0QsT0FBTyxFQUFFLCtCQUErQjthQUMzQztTQUNKO1FBQ0QsTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxJQUFJO1lBQ2QsV0FBVyxFQUFFLGtCQUFrQjtTQUNsQztRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsR0FBRyxFQUFFLENBQUM7U0FDVDtRQUNELFNBQVMsRUFBRTtZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHdEQUF3RDtTQUN4RTtLQUN3QixFQUFFO1FBQzNCLEdBQUcsRUFBRSxLQUFLO1FBQ1YsVUFBVSxFQUFFLEtBQUs7S0FDcEIsQ0FBQyxDQUFDO0lBRUg7UUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1NBQ3JCLENBQUMsQ0FBQztJQUNQLENBQUM7O0FBekRMLDBCQTBEQyJ9