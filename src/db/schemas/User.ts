import mongoose from "mongoose";
import { replaceKey } from "../../util";
import { DocumentFromModel, JSONFromModel } from "./base";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = Omit<JSONFromModel<typeof Model>, "_id"> & {
    rut: string;
};

/* eslint-disable camelcase */
export const Model = mongoose.model("user", new mongoose.Schema({
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
            validator: (phone: number): boolean => phone > 0 && phone.toString().length === 9,
        },
    },
    address_city: {
        type: String,
        required: true,
        cast: false,
        description: "The user's city address.",
    },
    address_street: {
        type: String,
        required: true,
        cast: false,
        description: "The user's street address.",
    },
    address_number: {
        type: Number,
        required: true,
        cast: false,
        description: "The user's street number address.",
        validate: {
            validator: (number: number): boolean => number > 0,
        },
    },
    address_secondary: {
        type: String,
        required: false,
        cast: false,
        default: null,
        description: "The user's apartment or building address.",
    },
    password: {
        type: String,
        required: true,
        cast: false,
        description: "The user's password.",
    },
}));
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKey(document.toJSON({
        versionKey: false,
    }), "_id", "rut");
}

const rutValidationSequence = [2, 3, 4, 5, 6, 7] as const;

function validateRut(rut: string): boolean {
    if (!/^\d{7,}-[\dk]$/i.test(rut)) return false;

    const [digits, expectedVerificationDigit] = rut.split("-");
    if ((+digits) < 1e6) return false;

    const sum = digits.split("").reverse().reduce((acc, d, i) =>
        acc + (+d) * rutValidationSequence[i % rutValidationSequence.length]
    , 0);

    const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
    const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
    return verificationDigit === expectedVerificationDigit.toUpperCase();
}
