import mongoose from "mongoose";
import { replaceKey } from "../../util";
import { DocumentFromModel, JSONFromModel } from "./base";

export type Document = DocumentFromModel<typeof Model>;
export type JSON = Omit<JSONFromModel<typeof Model>, "_id"> & {
    rut: number;
};

/* eslint-disable camelcase */
export const Model = mongoose.model("user", new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        alias: "rut",
    },
    first_name: {
        type: String,
        required: true,
    },
    second_name: {
        type: String,
        required: false,
        default: null,
    },
    first_last_name: {
        type: String,
        required: true,
    },
    second_last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    address_city: {
        type: String,
        required: true,
    },
    address_street: {
        type: String,
        required: true,
    },
    address_number: {
        type: Number,
        required: true,
    },
    address_secondary: {
        type: String,
        required: false,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
}));
/* eslint-enable camelcase */

export function toJSON(document: Document): JSON {
    return replaceKey(document.toJSON(), "_id", "rut");
}
