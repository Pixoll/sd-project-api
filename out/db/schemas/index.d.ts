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
import { HydratedDocument, Model } from "mongoose";
import { ReplaceKeys } from "../../util";
export * as Admin from "./Admin";
export * as Shipment from "./Shipment";
export * as User from "./User";
type StructureValidationOptions<JSON> = {
    partial?: boolean;
    exclude?: Array<keyof JSON & string>;
};
export declare function validateStructure<A, B, C, D, F, J extends A extends ReplaceKeys<infer JSON, infer _1> ? JSON : A>(object: object, Model: Model<A, B, C, D, HydratedDocument<A, D & C, B>, F>, options?: StructureValidationOptions<J>): Promise<true | string>;
