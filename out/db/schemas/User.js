"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.Model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const util_1 = require("../../util");
exports.Model = mongoose_1.default.model("user", new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        cast: false,
        alias: "rut",
        description: "The user's RUT.",
        validate: {
            validator: validateRut,
            message: "Invalid RUT.",
        },
    },
    first_name: {
        type: String,
        required: true,
        cast: false,
        description: "The user's first name.",
    },
    second_name: {
        type: String,
        required: false,
        cast: false,
        default: null,
        description: "The user's second name.",
    },
    first_last_name: {
        type: String,
        required: true,
        cast: false,
        description: "The user's first last name.",
    },
    second_last_name: {
        type: String,
        required: true,
        cast: false,
        description: "The user's second last name.",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        cast: false,
        description: "The user's email address.",
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        cast: false,
        description: "The user's phone number.",
        validate: {
            validator: (phone) => phone > 0 && phone.toString().length === 9,
            message: "Invalid phone number.",
        },
    },
    address: {
        type: {
            _id: false,
            region: {
                type: String,
                cast: false,
                required: true,
                description: "The user's region address.",
            },
            city: {
                type: String,
                cast: false,
                required: true,
                description: "The user's city address.",
            },
            street: {
                type: String,
                cast: false,
                required: true,
                description: "The user's street address.",
            },
            number: {
                type: Number,
                cast: false,
                required: true,
                description: "The user's street number address.",
            },
            secondary: {
                type: String,
                cast: false,
                required: false,
                default: null,
                description: "The user's secondary address information.",
            },
        },
        cast: false,
        required: true,
        description: "The user's address.",
    },
    password: {
        type: String,
        required: true,
        cast: false,
        description: "The user's password.",
        validate: {
            validator: (password) => password.length > 8,
            message: "Password must have at least 8 characters.",
        },
    },
}));
function toJSON(document) {
    return (0, util_1.replaceKey)(document.toJSON({
        versionKey: false,
    }), "_id", "rut");
}
exports.toJSON = toJSON;
const rutValidationSequence = [2, 3, 4, 5, 6, 7];
function validateRut(rut) {
    if (!/^\d{7,}-[\dk]$/i.test(rut))
        return false;
    const [digits, expectedVerificationDigit] = rut.split("-");
    if ((+digits) < 1e6)
        return false;
    const sum = digits.split("").reverse()
        .reduce((acc, d, i) => acc + (+d) * rutValidationSequence[i % rutValidationSequence.length], 0);
    const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
    const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
    return verificationDigit === expectedVerificationDigit.toUpperCase();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLHFDQUF3QztBQVMzQixRQUFBLEtBQUssR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FBQztJQUM1RCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxLQUFLLEVBQUUsS0FBSztRQUNaLFdBQVcsRUFBRSxpQkFBaUI7UUFDOUIsUUFBUSxFQUFFO1lBQ04sU0FBUyxFQUFFLFdBQVc7WUFDdEIsT0FBTyxFQUFFLGNBQWM7U0FDMUI7S0FDSjtJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSx3QkFBd0I7S0FDeEM7SUFDRCxXQUFXLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLFdBQVcsRUFBRSx5QkFBeUI7S0FDekM7SUFDRCxlQUFlLEVBQUU7UUFDYixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsNkJBQTZCO0tBQzdDO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsOEJBQThCO0tBQzlDO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtR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