"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.Model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const util_1 = require("../../util");
/* eslint-disable camelcase */
exports.Model = mongoose_1.default.model("user", new mongoose_1.default.Schema({
    _id: {
        type: Number,
        required: true,
        alias: "rut",
    },
    first_name: {
        type: String,
        required: true,
    },
    second_name: {
        type: String,
        required: false,
        default: null,
    },
    first_last_name: {
        type: String,
        required: true,
    },
    second_last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    address_city: {
        type: String,
        required: true,
    },
    address_street: {
        type: String,
        required: true,
    },
    address_number: {
        type: Number,
        required: true,
    },
    address_secondary: {
        type: String,
        required: false,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
}));
/* eslint-enable camelcase */
function toJSON(document) {
    return (0, util_1.replaceKey)(document.toJSON(), "_id", "rut");
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLHFDQUF3QztBQVF4Qyw4QkFBOEI7QUFDakIsUUFBQSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBQUM7SUFDNUQsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxLQUFLO0tBQ2Y7SUFDRCxVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNqQjtJQUNELGdCQUFnQixFQUFFO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNqQjtJQUNELEtBQUssRUFBRTtRQUNILElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtLQUNmO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO0tBQ2Y7SUFDRCxZQUFZLEVBQUU7UUFDVixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2pCO0lBQ0QsY0FBYyxFQUFFO1FBQ1osSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNqQjtJQUNELGNBQWMsRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDakI7SUFDRCxpQkFBaUIsRUFBRTtRQUNmLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsSUFBSTtLQUNoQjtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDakI7Q0FDSixDQUFDLENBQUMsQ0FBQztBQUNKLDZCQUE2QjtBQUU3QixTQUFnQixNQUFNLENBQUMsUUFBa0I7SUFDckMsT0FBTyxJQUFBLGlCQUFVLEVBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsd0JBRUMifQ==