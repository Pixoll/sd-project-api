"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.Model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./User");
const util_1 = require("../../util");
exports.Model = mongoose_1.default.model("admin", new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        cast: false,
        alias: "rut",
        description: "The admin's RUT.",
        validate: {
            validator: User_1.isValidRut,
            message: "Invalid RUT.",
        },
    },
    first_name: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's first name.",
    },
    second_name: {
        type: String,
        required: false,
        cast: false,
        default: null,
        description: "The admin's second name.",
    },
    first_last_name: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's first last name.",
    },
    second_last_name: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's second last name.",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        cast: false,
        description: "The admin's email address.",
        validate: {
            validator: (email) => User_1.emailRegex.test(email),
            message: "Invalid email.",
        },
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        cast: false,
        description: "The admin's phone number.",
        min: 0,
        validate: {
            validator: (phone) => phone.toString().length === 9,
            message: "Invalid phone number.",
        },
    },
    password: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's password.",
        validate: {
            validator: (password) => password.length >= 8,
            message: "Password must have at least 8 characters.",
        },
    },
    salt: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's salt for the password.",
    },
}, {
    versionKey: false,
    timestamps: true,
}));
function toJSON(document) {
    return (0, util_1.replaceKeys)(document.toJSON(), { _id: "rut" });
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9BZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsaUNBQWdEO0FBQ2hELHFDQUFzRDtBQWdCekMsUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBQW9DO0lBQ2hHLEdBQUcsRUFBRTtRQUNELElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUssRUFBRSxLQUFLO1FBQ1osV0FBVyxFQUFFLGtCQUFrQjtRQUMvQixRQUFRLEVBQUU7WUFDTixTQUFTLEVBQUUsaUJBQVU7WUFDckIsT0FBTyxFQUFFLGNBQWM7U0FDMUI7S0FDSjtJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSx5QkFBeUI7S0FDekM7SUFDRCxXQUFXLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLFdBQVcsRUFBRSwwQkFBMEI7S0FDMUM7SUFDRCxlQUFlLEVBQUU7UUFDYixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsOEJBQThCO0tBQzlDO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsK0JBQStCO0tBQy9DO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsNEJBQTRCO1FBQ3pDLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxDQUFDLEtBQWEsRUFBVyxFQUFFLENBQUMsaUJBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzdELE9BQU8sRUFBRSxnQkFBZ0I7U0FDNUI7S0FDSjtJQUNELEtBQUssRUFBRTtRQUNILElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxHQUFHLEVBQUUsQ0FBQztRQUNOLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxDQUFDLEtBQWEsRUFBVyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3BFLE9BQU8sRUFBRSx1QkFBdUI7U0FDbkM7S0FDSjtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsUUFBUSxFQUFFO1lBQ04sU0FBUyxFQUFFLENBQUMsUUFBZ0IsRUFBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQzlELE9BQU8sRUFBRSwyQ0FBMkM7U0FDdkQ7S0FDSjtJQUNELElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSxvQ0FBb0M7S0FDcEQ7Q0FDd0IsRUFBRTtJQUMzQixVQUFVLEVBQUUsS0FBSztJQUNqQixVQUFVLEVBQUUsSUFBSTtDQUNuQixDQUFDLENBQUMsQ0FBQztBQUdKLFNBQWdCLE1BQU0sQ0FBQyxRQUFrQjtJQUNyQyxPQUFPLElBQUEsa0JBQVcsRUFBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFXLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRkQsd0JBRUMifQ==