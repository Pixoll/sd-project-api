"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
const util_1 = require("../util");
class Admin extends null {
    static Model = mongoose_1.default.model("admin", new mongoose_1.default.Schema({
        _id: {
            type: String,
            required: true,
            cast: false,
            alias: "rut",
            description: "The admin's RUT.",
            validate: {
                validator: user_1.User.isValidRut,
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
                validator: (email) => user_1.User.emailRegex.test(email),
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
    static toJSON(document) {
        return util_1.Util.replaceKeys(document.toJSON(), {
            _id: "rut",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        });
    }
}
exports.Admin = Admin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NoZW1hcy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsaUNBQThCO0FBQzlCLGtDQUErQjtBQUUvQixNQUFhLEtBQU0sU0FBUSxJQUFJO0lBQ3BCLE1BQU0sQ0FBVSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBSXRFO1FBQ0EsR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEtBQUs7WUFDWixXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLFFBQVEsRUFBRTtnQkFDTixTQUFTLEVBQUUsV0FBSSxDQUFDLFVBQVU7Z0JBQzFCLE9BQU8sRUFBRSxjQUFjO2FBQzFCO1NBQ0o7UUFDRCxVQUFVLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLEtBQUs7WUFDWCxXQUFXLEVBQUUseUJBQXlCO1NBQ3pDO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsS0FBSztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsMEJBQTBCO1NBQzFDO1FBQ0QsZUFBZSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLDhCQUE4QjtTQUM5QztRQUNELGdCQUFnQixFQUFFO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLCtCQUErQjtTQUMvQztRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtZQUNaLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLDRCQUE0QjtZQUN6QyxRQUFRLEVBQUU7Z0JBQ04sU0FBUyxFQUFFLENBQUMsS0FBYSxFQUFXLEVBQUUsQ0FBQyxXQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2xFLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUI7U0FDSjtRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtZQUNaLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxHQUFHLEVBQUUsQ0FBQztZQUNOLFFBQVEsRUFBRTtnQkFDTixTQUFTLEVBQUUsQ0FBQyxLQUFhLEVBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDcEUsT0FBTyxFQUFFLHVCQUF1QjthQUNuQztTQUNKO1FBQ0QsUUFBUSxFQUFFO1lBQ04sSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxRQUFRLEVBQUU7Z0JBQ04sU0FBUyxFQUFFLENBQUMsUUFBZ0IsRUFBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUM5RCxPQUFPLEVBQUUsMkNBQTJDO2FBQ3ZEO1NBQ0o7UUFDRCxJQUFJLEVBQUU7WUFDRixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLEtBQUs7WUFDWCxXQUFXLEVBQUUsb0NBQW9DO1NBQ3BEO0tBQ3dCLEVBQUU7UUFDM0IsVUFBVSxFQUFFLEtBQUs7UUFDakIsVUFBVSxFQUFFLElBQUk7S0FDbkIsQ0FBQyxDQUFDLENBQUM7SUFFRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQStDO1FBQ2hFLE9BQU8sV0FBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdkMsR0FBRyxFQUFFLEtBQUs7WUFDVixTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFNBQVMsRUFBRSxtQkFBbUI7U0FDeEIsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7O0FBNUZMLHNCQTZGQyJ9