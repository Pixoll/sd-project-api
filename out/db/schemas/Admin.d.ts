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
import { DocumentFromModel } from "./base";
import { ReplaceKeys } from "../../util";
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
export declare const Model: mongoose.Model<ReplaceKeys<JSON, {
    rut: "_id";
}>, {}, {}, {}, mongoose.Document<unknown, {}, ReplaceKeys<JSON, {
    rut: "_id";
}>> & Omit<JSON, "rut"> & {
    _id: string;
} & Required<{
    _id: string;
}>, mongoose.Schema<ReplaceKeys<JSON, {
    rut: "_id";
}>, mongoose.Model<ReplaceKeys<JSON, {
    rut: "_id";
}>, any, any, any, mongoose.Document<unknown, any, ReplaceKeys<JSON, {
    rut: "_id";
}>> & Omit<JSON, "rut"> & {
    _id: string;
} & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ReplaceKeys<JSON, {
    rut: "_id";
}>, mongoose.Document<unknown, {}, mongoose.FlatRecord<ReplaceKeys<JSON, {
    rut: "_id";
}>>> & mongoose.FlatRecord<ReplaceKeys<JSON, {
    rut: "_id";
}>> & Required<{
    _id: string;
}>>>;
export declare function toJSON(document: Document): JSON;
