import mongoose from "mongoose";
import { SchemaTypeOptions } from "./base";
import { RegionsEndpoint } from "../../endpoints/regions";

export type JSON = {
    region: string;
    city: string;
    street: string;
    number: number;
    secondary?: string | null | undefined;
};

export const Schema = new mongoose.Schema<JSON>({
    region: {
        type: String,
        cast: false,
        required: true,
        description: "The region.",
        validate: {
            validator: (region: string): boolean => RegionsEndpoint.regions.some(r =>
                r.name.toLowerCase() === region.toLowerCase()
            ),
            message: "Invalid region name.",
        },
    },
    city: {
        type: String,
        cast: false,
        required: true,
        description: "The city or commune.",
        validate: {
            validator(this: { region: string }, commune: string): boolean {
                return !!RegionsEndpoint.regions
                    .find(r => r.name.toLowerCase() === this.region.toLowerCase())?.communes
                    .some(c => c.toLowerCase() === commune.toLowerCase());
            },
            message: "Invalid city or commune name.",
        },
    },
    street: {
        type: String,
        cast: false,
        required: true,
        description: "The street name.",
    },
    number: {
        type: Number,
        cast: false,
        required: true,
        description: "The street number.",
        min: 0,
    },
    secondary: {
        type: String,
        cast: false,
        required: false,
        default: null,
        description: "Secondary address information like apartment building.",
    },
} satisfies SchemaTypeOptions, {
    _id: false,
    versionKey: false,
});

// @ts-expect-error: for documentation
Schema.name = "Address";
