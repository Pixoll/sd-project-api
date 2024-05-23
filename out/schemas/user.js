"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const address_1 = require("./address");
const util_1 = require("../util");
class User extends null {
    static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static rutValidationSequence = [2, 3, 4, 5, 6, 7];
    static Model = mongoose_1.default.model("user", new mongoose_1.default.Schema({
        _id: {
            type: String,
            required: true,
            cast: false,
            alias: "rut",
            description: "The user's RUT.",
            validate: {
                validator: User.isValidRut,
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
                validator: (email) => User.emailRegex.test(email),
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
            type: address_1.Address.Schema,
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
    static toJSON(document) {
        return util_1.Util.replaceKeys(document.toJSON(), {
            _id: "rut",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        });
    }
    static isValidRut(rut) {
        if (!/^\d{7,}-[\dk]$/i.test(rut))
            return false;
        const [digits, expectedVerificationDigit] = rut.split("-");
        if ((+digits) < 1e6)
            return false;
        const sum = digits.split("").reverse()
            .reduce((acc, d, i) => acc + (+d) * User.rutValidationSequence[i % User.rutValidationSequence.length], 0);
        const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
        const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
        return verificationDigit === expectedVerificationDigit.toUpperCase();
    }
}
exports.User = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLHVDQUFvQztBQUNwQyxrQ0FBK0I7QUFFL0IsTUFBYSxJQUFLLFNBQVEsSUFBSTtJQUtuQixNQUFNLENBQVUsVUFBVSxHQUFHLHNKQUFzSixDQUFDO0lBRW5MLE1BQU0sQ0FBVSxxQkFBcUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFVLENBQUM7SUFFckUsTUFBTSxDQUFVLEtBQUssR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FJckU7UUFDQSxHQUFHLEVBQUU7WUFDRCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsS0FBSztZQUNaLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsUUFBUSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDMUIsT0FBTyxFQUFFLGNBQWM7YUFDMUI7U0FDSjtRQUNELFVBQVUsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsS0FBSztZQUNYLFdBQVcsRUFBRSx3QkFBd0I7U0FDeEM7UUFDRCxXQUFXLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxLQUFLO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSx5QkFBeUI7U0FDekM7UUFDRCxlQUFlLEVBQUU7WUFDYixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLEtBQUs7WUFD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