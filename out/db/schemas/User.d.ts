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
import * as Address from "./Address";
import { ReplaceKey } from "../../util";
export type Document = DocumentFromModel<typeof Model>;
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
};
export declare const emailRegex: RegExp;
export declare const Model: mongoose.Model<ReplaceKey<JSON, "rut", "_id">, {}, {}, {}, mongoose.Document<unknown, {}, ReplaceKey<JSON, "rut", "_id">> & Omit<JSON, "rut"> & Record<"_id", string> & Required<{
    _id: string;
}>, mongoose.Schema<ReplaceKey<JSON, "rut", "_id">, mongoose.Model<ReplaceKey<JSON, "rut", "_id">, any, any, any, mongoose.Document<unknown, any, ReplaceKey<JSON, "rut", "_id">> & Omit<JSON, "rut"> & Record<"_id", string> & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ReplaceKey<JSON, "rut", "_id">, mongoose.Document<unknown, {}, mongoose.FlatRecord<ReplaceKey<JSON, "rut", "_id">>> & mongoose.FlatRecord<ReplaceKey<JSON, "rut", "_id">> & Required<{
    _id: string;
}>>>;
export declare function toJSON(document: Document): JSON;
export declare function isValidRut(rut: string): boolean;
