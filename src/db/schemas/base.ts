/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, SchemaTypeOptions } from "mongoose";

export type SchemaObject = Record<string, SchemaTypeOptions<unknown> & { type: unknown }>;
export type AnyModel = Model<any, any, any, any, any, any>;
export type JSONFromModel<M extends AnyModel> = M extends Model<infer JSON, any, any, any, any, any> ? JSON : never;
export type DocumentFromModel<M extends AnyModel> = M extends Model<any, any, any, any, infer Doc, any> ? Doc : never;
