import mongoose from "mongoose";
import { SchemaTypeOptions } from "./base";
import { FeesEndpoint } from "../endpoints/fees";

export class Package extends null {
    private static readonly types = FeesEndpoint.fees.package_type.map(p => p.id);
    private static readonly typesList = Package.types.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");

    public static readonly Schema = new mongoose.Schema<Package.JSON>({
        type: {
            type: String,
            enum: Package.types,
            required: true,
            cast: false,
            description: `Type of the package. One of: ${Package.typesList}.`,
        },
        description: {
            type: String,
            required: true,
            cast: false,
            description: "Brief description of what the package contains.",
        },
        length: {
            type: Number,
            required: true,
            cast: false,
            min: 0,
            description: "Length of the package in mm.",
        },
        width: {
            type: Number,
            required: true,
            cast: false,
            min: 0,
            description: "Width of the package in mm.",
        },
        height: {
            type: Number,
            required: true,
            cast: false,
            min: 0,
            description: "Height of the package in mm.",
        },
        weight: {
            type: Number,
            required: true,
            cast: false,
            min: 0,
            description: "Weight of the package in kg.",
        },
    } satisfies SchemaTypeOptions, {
        _id: false,
        versionKey: false,
    });

    static {
        Object.assign(Package.Schema, {
            name: Package.name,
        });
    }
}

export namespace Package {
    export type JSON = {
        type: string;
        description: string;
        length: number;
        width: number;
        height: number;
        weight: number;
    };
}
