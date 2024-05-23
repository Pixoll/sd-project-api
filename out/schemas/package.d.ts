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
export declare class Package extends null {
    private static readonly types;
    private static readonly typesList;
    static readonly Schema: mongoose.Schema<Package.JSON, mongoose.Model<Package.JSON, any, any, any, mongoose.Document<unknown, any, Package.JSON> & Package.JSON & {
        _id: mongoose.Types.ObjectId;
    }, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Package.JSON, mongoose.Document<unknown, {}, mongoose.FlatRecord<Package.JSON>> & mongoose.FlatRecord<Package.JSON> & {
        _id: mongoose.Types.ObjectId;
    }>;
}
export declare namespace Package {
    type JSON = {
        type: string;
        description: string;
        length: number;
        width: number;
        height: number;
        weight: number;
    };
}
