import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions } from "./base";
import * as Address from "./Address";
import { ReplaceKey, replaceKey } from "../../util";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = {
    rut: string;
    first_name: string;
    second_name: string | null;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: Address.JSON;
    password: string;
    salt: string;
    verified: boolean;
};

/**
 * @see https://emailregex.com/
 */
// eslint-disable-next-line max-len
export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* eslint-disable camelcase */
export const Model = mongoose.model("user", new mongoose.Schema<ReplaceKey<JSON, "rut", "_id">>({
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
            validator: (email: string): boolean => emailRegex.test(email),
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
            validator: (phone: number): boolean => phone.toString().length === 9,
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
            validator: (password: string): boolean => password.length >= 8,
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
} satisfies SchemaTypeOptions, {
    versionKey: false,
}));
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKey(document.toJSON(), "_id", "rut");
}

const rutValidationSequence = [2, 3, 4, 5, 6, 7] as const;

export function isValidRut(rut: string): boolean {
    if (!/^\d{7,}-[\dk]$/i.test(rut)) return false;

    const [digits, expectedVerificationDigit] = rut.split("-");
    if ((+digits) < 1e6) return false;

    const sum = digits.split("").reverse()
        .reduce((acc, d, i) => acc + (+d) * rutValidationSequence[i % rutValidationSequence.length], 0);

    const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
    const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
    return verificationDigit === expectedVerificationDigit.toUpperCase();
}
