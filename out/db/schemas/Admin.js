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
    return util_1.Util.replaceKeys(document.toJSON(), {
        _id: "rut",
        createdAt: "created_timestamp",
        updatedAt: "updated_timestamp",
    });
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvc2NoZW1hcy9BZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsaUNBQWdEO0FBQ2hELHFDQUFrQztBQWdCckIsUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBSTVEO0lBQ0EsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsa0JBQWtCO1FBQy9CLFFBQVEsRUFBRTtZQUNOLFNBQVMsRUFBRSxpQkFBVTtZQUNyQixPQUFPLEVBQUUsY0FBYztTQUMxQjtLQUNKO0lBQ0QsVUFBVSxFQUFFO1FBQ1IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLHlCQUF5QjtLQUN6QztJQUNELFdBQVcsRUFBRTtRQUNULElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsS0FBSztRQUNYLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLDBCQUEwQjtLQUMxQztJQUNELGVBQWUsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSw4QkFBOEI7S0FDOUM7SUFDRCxnQkFBZ0IsRUFBRTtRQUNkLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSwrQkFBK0I7S0FDL0M7SUFDRCxLQUFLLEVBQUU7UUFDSCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsUUFBUSxFQUFFO1lBQ04sU0FBUyxFQUFFLENBQUMsS0FBYSxFQUFXLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDN0QsT0FBTyxFQUFFLGdCQUFnQjtTQUM1QjtLQUNKO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxXQUFXLEVBQUUsMkJBQTJCO1FBQ3hDLEdBQUcsRUFBRSxDQUFDO1FBQ04sUUFBUSxFQUFFO1lBQ04sU0FBUyxFQUFFLENBQUMsS0FBYSxFQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDcEUsT0FBTyxFQUFFLHVCQUF1QjtTQUNuQztLQUNKO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxRQUFRLEVBQUU7WUFDTixTQUFTLEVBQUUsQ0FBQyxRQUFnQixFQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDOUQsT0FBTyxFQUFFLDJDQUEyQztTQUN2RDtLQUNKO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLG9DQUFvQztLQUNwRDtDQUN3QixFQUFFO0lBQzNCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFVBQVUsRUFBRSxJQUFJO0NBQ25CLENBQUMsQ0FBQyxDQUFDO0FBR0osU0FBZ0IsTUFBTSxDQUFDLFFBQWtCO0lBQ3JDLE9BQU8sV0FBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDdkMsR0FBRyxFQUFFLEtBQUs7UUFDVixTQUFTLEVBQUUsbUJBQW1CO1FBQzlCLFNBQVMsRUFBRSxtQkFBbUI7S0FDeEIsQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFORCx3QkFNQyJ9