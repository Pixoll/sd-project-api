/// <reference types="express" />
export declare const regions: readonly {
    readonly name: string;
    readonly communes: readonly string[];
}[];
export declare const methods: {
    get(_: import("express").Request<Record<string, string>, unknown, unknown, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<readonly {
        readonly name: string;
        readonly communes: readonly string[];
    }[], Record<string, any>>): void;
};
