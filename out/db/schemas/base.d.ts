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
export type JSONFromModel<M> = M extends mongoose.Model<infer JSON, infer _2, infer _3, infer _4, infer _5, infer _6> ? {
    [K in keyof JSON]: JSON[K] extends mongoose.Types.DocumentArray<infer D> ? D[] : JSON[K];
} : never;
export type DocumentFromModel<M> = M extends mongoose.Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6> ? Doc : never;
export type SchemaTypeOptions = Record<string, mongoose.SchemaTypeOptions<any> & {
    description: string;
}>;
