/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import mongoose, { Model } from "mongoose";

export type JSONFromModel<M> = M extends Model<infer JSON, infer _2, infer _3, infer _4, infer _5, infer _6> ? JSON : never;
export type DocumentFromModel<M> = M extends Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6>
    ? Doc
    : never;
export type SchemaTypeOptions = Record<string, mongoose.SchemaTypeOptions<any>> | {
    _id?: boolean;
};
