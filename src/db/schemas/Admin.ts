import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions } from "./base";
import { emailRegex, isValidRut } from "./User";
import { ReplaceKeys, replaceKeys } from "../../util";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = {
    rut: string;
    first_name: string;
    second_name?: string | null | undefined;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    password: string;
    salt: string;
};

/* eslint-disable camelcase */
export const Model = mongoose.model("admin", new mongoose.Schema<ReplaceKeys<JSON, { rut: "_id" }>>({
    _id: {
        type: String,
        required: true,
        cast: false,
        alias: "rut",
        description: "The admin's RUT.",
        validate: {
            validator: isValidRut,
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
            validator: (email: string): boolean => emailRegex.test(email),
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
            validator: (phone: number): boolean => phone.toString().length === 9,
            message: "Invalid phone number.",
        },
    },
    password: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's password.",
        validate: {
            validator: (password: string): boolean => password.length >= 8,
            message: "Password must have at least 8 characters.",
        },
    },
    salt: {
        type: String,
        required: true,
        cast: false,
        description: "The admin's salt for the password.",
    },
} satisfies SchemaTypeOptions, {
    versionKey: false,
    timestamps: true,
}));
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKeys(document.toJSON(), { _id: "rut" } as const);
}
