/// <reference types="qs" />
/// <reference types="express" />
export declare const regions: readonly {
    readonly name: string;
    readonly communes: readonly string[];
}[];
export declare const methods: {
    get(_: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, response: import("express").Response<any, Record<string, any>>): void;
};
