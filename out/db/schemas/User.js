"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRut = exports.toJSON = exports.Model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Address_1 = require("./Address");
const util_1 = require("../../util");
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        validate: {
            validator: (email) => emailRegex.test(email),
            message: "Invalid email.",
        },
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        cast: false,
        description: "The user's phone number.",
        min: 0,
        validate: {
            validator: (phone) => phone.toString().length === 9,
            message: "Invalid phone number.",
        },
    },
    address: {
        type: Address_1.Schema,
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
            validator: (password) => password.length >= 8,
            message: "Password must have at least 8 characters.",
        },
    },
    salt: {
        type: String,
        required: true,
        cast: false,
        description: "The user's salt for the password.",
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
exports.validateRut = validateRut;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLHVDQUE4QztBQUM5QyxxQ0FBd0M7QUFXeEMsTUFBTSxVQUFVLEdBQUcsc0pBQXNKLENBQUM7QUFHN0osUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBQUM7SUFDNUQsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsaUJBQWlCO1FBQzlCLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxXQUFXO1lBQ3RCLE9BQU8sRUFBRSxjQUFjO1NBQzFCO0tBQ0o7SUFDRCxVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsd0JBQXdCO0tBQ3hDO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUseUJBQXlCO0tBQ3pDO0lBQ0QsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLDZCQUE2QjtLQUM3QztJQUNELGdCQUFnQixFQUFFO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLDhCQUE4QjtLQUM5QztJQUNELEtBQUss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