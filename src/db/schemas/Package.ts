import mongoose from "mongoose";
import { SchemaTypeOptions } from "./base";
import { FeesEndpoint } from "../../endpoints/fees";

export type JSON = {
    type: string;
    description: string;
    length: number;
    width: number;
    height: number;
    weight: number;
};

const packageTypes = FeesEndpoint.fees.package_type.map(p => p.id);
const packageTypesList = packageTypes.map(t => `\`${t}\``).join(", ").replace(/, ([^,]+)$/, " or $1");

export const Schema = new mongoose.Schema<JSON>({
    type: {
        type: String,
        enum: packageTypes,
        required: true,
        cast: false,
        description: `Type of the package. One of: ${packageTypesList}.`,
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

// @ts-expect-error: for documentation
Schema.name = "Package";
