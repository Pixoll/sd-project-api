/// <reference types="qs" />
/// <reference types="express" />
export declare const fees: {
    readonly shipping: readonly {
        readonly id: string;
        readonly name: string;
        readonly fee: number;
    }[];
    readonly extra: readonly {
        readonly id: string;
        readonly name: string;
        readonly fee: number;
    }[];
    readonly package_type: readonly {
        readonly id: string;
        readonly name: string;
        readonly fee: number;
    }[];
};
export declare const methods: {
    get(_: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, response: import("express").Response<any, Record<string, any>>): void;
};
