/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose from "mongoose";
import { DocumentFromModel, JSONFromModel } from "./base";
export type Document = DocumentFromModel<typeof Model>;
export type JSON = Omit<JSONFromModel<typeof Model>, "_id"> & {
    rut: string;
};
export declare const Model: mongoose.Model<{
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
}> & {
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
} & Required<{
    _id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    _id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    email: string;
    phone: number;
    address: {
        number: number;
        region: string;
        city: string;
        street: string;
        secondary?: string | null | undefined;
    };
    password: string;
    salt: string;
    second_name?: string | null | undefined;
}> & Required<{
    _id: string;
}>>>;
export declare function toJSON(document: Document): JSON;
export declare function validateRut(rut: string): boolean;
