/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

export type JSONFromModel<M> = M extends mongoose.Model<infer JSON, infer _2, infer _3, infer _4, infer _5, infer _6> ? {
    [K in keyof JSON]: JSON[K] extends mongoose.Types.DocumentArray<infer D> ? D[] : JSON[K];
} : never;
export type DocumentFromModel<M> = M extends mongoose.Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6>
    ? Doc
    : never;
export type SchemaTypeOptions = Record<string, mongoose.SchemaTypeOptions<any> & {
    description: string;
}>;
