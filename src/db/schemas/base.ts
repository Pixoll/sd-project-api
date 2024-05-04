import { Model } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JSONFromModel<M> = M extends Model<infer JSON, infer _2, infer _3, infer _4, infer _5, infer _6> ? JSON : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DocumentFromModel<M> = M extends Model<infer _1, infer _2, infer _3, infer _4, infer Doc, infer _6>
    ? Doc
    : never;
