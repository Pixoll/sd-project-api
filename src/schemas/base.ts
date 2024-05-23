/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

export type DocumentFromModel<M> = M extends mongoose.Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6>
    ? Doc
    : never;
export type SchemaTypeOptions = Record<string, mongoose.SchemaTypeOptions<any> & {
    description: string;
}>;
export type Timestamps = {
    created_timestamp: number;
    updated_timestamp: number;
};
