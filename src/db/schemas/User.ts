import mongoose from "mongoose";
import { replaceKey } from "../../util";
import { DocumentFromModel, JSONFromModel, SchemaTypeOptions } from "./base";
import { regions } from "../../endpoints/regions";

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
        min: 0,
        validate: {
            validator: (phone: number): boolean => phone.toString().length === 9,
            message: "Invalid phone number.",
        },
    },
    address: {
        type: {
            _id: false,
            region: {
                type: String,
                cast: false,
                required: true,
                description: "The user's region address.",
                validate: {
                    validator: (region: string): boolean => regions.some(r =>
                        r.name.toLowerCase() === region.toLowerCase()
                    ),
                    message: "Invalid region name.",
                },
            },
            city: {
                type: String,
                cast: false,
                required: true,
                description: "The user's city address.",
                validate: {
                    validator(this: { region: string }, commune: string): boolean {
                        return !!regions
                            .find(r => r.name.toLowerCase() === this.region.toLowerCase())?.communes
                            .some(c => c.toLowerCase() === commune.toLowerCase());
                    },
                    message: "Invalid city/commune name.",
                },
            },
            street: {
                type: String,
                cast: false,
                required: true,
                description: "The user's street address.",
            },
            number: {
                type: Number,
                cast: false,
                required: true,
                description: "The user's street number address.",
                min: 0,
            },
            secondary: {
                type: String,
                cast: false,
                required: false,
                default: null,
                description: "The user's secondary address information.",
            },
        } satisfies SchemaTypeOptions,
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
            validator: (password: string): boolean => password.length > 8,
            message: "Password must have at least 8 characters.",
        },
    },
} satisfies SchemaTypeOptions));
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

    const sum = digits.split("").reverse()
        .reduce((acc, d, i) => acc + (+d) * rutValidationSequence[i % rutValidationSequence.length], 0);

    const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
    const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
    return verificationDigit === expectedVerificationDigit.toUpperCase();
}
