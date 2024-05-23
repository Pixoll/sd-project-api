import mongoose from "mongoose";
import { DocumentFromModel, SchemaTypeOptions, Timestamps } from "./base";
import { User } from "./user";
import { Util } from "../util";

export class Admin extends null {
    public static readonly Model = mongoose.model("admin", new mongoose.Schema<Util.ReplaceKeys<Admin.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>>({
        _id: {
            type: String,
            required: true,
            cast: false,
            alias: "rut",
            description: "The admin's RUT.",
            validate: {
                validator: User.isValidRut,
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
                validator: (email: string): boolean => User.emailRegex.test(email),
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

    public static toJSON(document: DocumentFromModel<typeof Admin.Model>): Admin.JSON {
        return Util.replaceKeys(document.toJSON(), {
            _id: "rut",
            createdAt: "created_timestamp",
            updatedAt: "updated_timestamp",
        } as const);
    }
}

export namespace Admin {
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
    } & Timestamps;
}
