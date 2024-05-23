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
export declare class Address extends null {
    static readonly Schema: mongoose.Schema<Address.JSON, mongoose.Model<Address.JSON, any, any, any, mongoose.Document<unknown, any, Address.JSON> & Address.JSON & {
        _id: mongoose.Types.ObjectId;
    }, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Address.JSON, mongoose.Document<unknown, {}, mongoose.FlatRecord<Address.JSON>> & mongoose.FlatRecord<Address.JSON> & {
        _id: mongoose.Types.ObjectId;
    }>;
}
export declare namespace Address {
    type JSON = {
        region: string;
        city: string;
        street: string;
        number: number;
        secondary?: string | null | undefined;
    };
}
