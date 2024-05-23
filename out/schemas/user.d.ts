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
import { DocumentFromModel, Timestamps } from "./base";
import { Address } from "./address";
import { Util } from "../util";
export declare class User extends null {
    static readonly emailRegex: RegExp;
    private static readonly rutValidationSequence;
    static readonly Model: mongoose.Model<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, {}, {}, {}, mongoose.Document<unknown, {}, Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Omit<User.JSON, "rut" | "created_timestamp" | "updated_timestamp"> & {
        _id: string;
        createdAt: number;
        updatedAt: number;
    } & Required<{
        _id: string;
    }>, mongoose.Schema<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, mongoose.Model<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, any, any, any, mongoose.Document<unknown, any, Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Omit<User.JSON, "rut" | "created_timestamp" | "updated_timestamp"> & {
        _id: string;
        createdAt: number;
        updatedAt: number;
    } & Required<{
        _id: string;
    }>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>, mongoose.Document<unknown, {}, mongoose.FlatRecord<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>>> & mongoose.FlatRecord<Util.ReplaceKeys<User.JSON, {
        rut: "_id";
        created_timestamp: "createdAt";
        updated_timestamp: "updatedAt";
    }>> & Required<{
        _id: string;
    }>>>;
    static toJSON(document: DocumentFromModel<typeof User.Model>): User.JSON;
    static isValidRut(rut: string): boolean;
}
export declare namespace User {
    type JSON = {
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
