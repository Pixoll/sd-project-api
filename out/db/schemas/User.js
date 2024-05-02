"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.Model = void 0;
const util_1 = require("../../util");
const base_1 = require("./base");
exports.Model = (0, base_1.model)("user", new base_1.Schema({
    _id: {
        type: String,
        required: true,
        alias: "rut",
        description: "The user's RUT.",
    },
    first_name: {
        type: String,
        required: true,
        description: "The user's first name.",
    },
    second_name: {
        type: String,
        required: false,
        default: null,
        description: "The user's second name.",
    },
    first_last_name: {
        type: String,
        required: true,
        description: "The user's first last name.",
    },
    second_last_name: {
        type: String,
        required: true,
        description: "The user's second last name.",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        description: "The user's email address.",
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        description: "The user's phone number.",
    },
    address_city: {
        type: String,
        required: true,
        description: "The user's city address.",
    },
    address_street: {
        type: String,
        required: true,
        description: "The user's street address.",
    },
    address_number: {
        type: Number,
        required: true,
        description: "The user's street number address.",
    },
    address_secondary: {
        type: String,
        required: false,
        default: null,
        description: "The user's apartment or building address.",
    },
    password: {
        type: String,
        required: true,
        description: "The user's password.",
    },
}));
function toJSON(document) {
    return (0, util_1.replaceKey)(document.toJSON(), "_id", "rut");
}
exports.toJSON = toJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9zY2hlbWFzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXdDO0FBQ3hDLGlDQUF5RTtBQVE1RCxRQUFBLEtBQUssR0FBRyxJQUFBLFlBQUssRUFBQyxNQUFNLEVBQUUsSUFBSSxhQUFNLENBQUM7SUFDMUMsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osV0FBVyxFQUFFLGlCQUFpQjtLQUNqQztJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxXQUFXLEVBQUUsd0JBQXdCO0tBQ3hDO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLHlCQUF5QjtLQUN6QztJQUNELGVBQWUsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxXQUFXLEVBQUUsNkJBQTZCO0tBQzdDO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsV0FBVyxFQUFFLDhCQUE4QjtLQUM5QztJQUNELEtBQUssRUFBRTtRQUNILElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLFdBQVcsRUFBRSwyQkFBMkI7S0FDM0M7SUFDRCxLQUFLLEVBQUU7UUFDSCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7UUFDWixXQUFXLEVBQUUsMEJBQTBCO0tBQzFDO0lBQ0QsWUFBWSxFQUFFO1FBQ1YsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFdBQVcsRUFBRSwwQkFBMEI7S0FDMUM7SUFDRCxjQUFjLEVBQUU7UUFDWixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsV0FBVyxFQUFFLDRCQUE0QjtLQUM1QztJQUNELGNBQWMsRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxXQUFXLEVBQUUsbUNBQW1DO0tBQ25EO0lBQ0QsaUJBQWlCLEVBQUU7UUFDZixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxLQUFLO1FBQ2YsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUsMkNBQTJDO0tBQzNEO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFdBQVcsRUFBRSxzQkFBc0I7S0FDdEM7Q0FDSixDQUFDLENBQUMsQ0FBQztBQUdKLFNBQWdCLE1BQU0sQ0FBQyxRQUFrQjtJQUNyQyxPQUFPLElBQUEsaUJBQVUsRUFBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFGRCx3QkFFQyJ9