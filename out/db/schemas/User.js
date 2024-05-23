"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRut = exports.toJSON = exports.Model = exports.emailRegex = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Address = __importStar(require("./Address"));
const util_1 = require("../../util");
exports.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.Model = mongoose_1.default.model("user", new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        cast: false,
        alias: "rut",
        description: "The user's RUT.",
        validate: {
            validator: isValidRut,
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
            validator: (email) => exports.emailRegex.test(email),
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
        type: Address.Schema,
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
    verified: {
        type: Boolean,
        required: false,
        cast: false,
        default: false,
        description: "Whether the user has verified their identity or not.",
    },
}, {
    versionKey: false,
    timestamps: true,
}));
function toJSON(document) {
    return util_1.Util.replaceKeys(document.toJSON(), {
        _id: "rut",
        createdAt: "created_timestamp",
        updatedAt: "updated_timestamp",
    });
}
exports.toJSON = toJSON;
const rutValidationSequence = [2, 3, 4, 5, 6, 7];
function isValidRut(rut) {
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
exports.isValidRut = isValidRut;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsbURBQXFDO0FBQ3JDLHFDQUFrQztBQXFCckIsUUFBQSxVQUFVLEdBQUcsc0pBQXNKLENBQUM7QUFHcEssUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBSTNEO0lBQ0EsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsaUJBQWlCO1FBQzlCLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSxjQUFjO1NBQzFCO0tBQ0o7SUFDRCxVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsd0JBQXdCO0tBQ3hDO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUseUJBQXlCO0tBQ3pDO0lBQ0QsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLDZCQUE2QjtLQUM3QztJQUNELGdCQUFnQixFQUFFO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFF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