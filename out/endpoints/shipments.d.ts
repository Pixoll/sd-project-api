/// <reference types="qs" />
/// <reference types="express" />
export declare const methods: {
    get(request: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, response: import("express").Response<any, Record<string, any>>): Promise<void>;
    post(request: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, response: import("express").Response<any, Record<string, any>>): Promise<void>;
};
