import { replaceKey } from "../../util";
import { DocumentFromModel, JSONFromModel, Schema, model } from "./base";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = Omit<JSONFromModel<typeof Model>, "_id"> & {
    rut: number;
};

/* eslint-disable camelcase */
export const Model = model("user", new Schema({
    _id: {
        type: Number,
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
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKey(document.toJSON(), "_id", "rut");
}
