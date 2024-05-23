import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions, Timestamps } from "./base";
import { Address } from "./address";
import { Util } from "../util";

export class User extends null {
    /**
    * @see https://emailregex.com/
    */
    // eslint-disable-next-line max-len
    public static readonly emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    private static readonly rutValidationSequence = [2, 3, 4, 5, 6, 7] as const;

    public static readonly Model = mongoose.model("user", new mongoose.Schema<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>>({
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
                validator: (email: string): boolean => User.emailRegex.test(email),
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
        timestamps: true,
    }));

    public static toJSON(document: DocumentFromModel<typeof User.Model>): User.JSON {
        return Util.replaceKeys(document.toJSON(), {
            _id: "rut",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        } as const);
    }

    public static isValidRut(rut: string): boolean {
        if (!/^\d{7,}-[\dk]$/i.test(rut)) return false;

        const [digits, expectedVerificationDigit] = rut.split("-");
        if ((+digits) < 1e6) return false;

        const sum = digits.split("").reverse()
            .reduce((acc, d, i) => acc + (+d) * User.rutValidationSequence[i % User.rutValidationSequence.length], 0);

        const verificationNumber = 11 - sum + Math.trunc(sum / 11) * 11;
        const verificationDigit = verificationNumber === 10 ? "K" : (verificationNumber % 11).toString();
        return verificationDigit === expectedVerificationDigit.toUpperCase();
    }
}

export namespace User {
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
    } & Timestamps;
}
