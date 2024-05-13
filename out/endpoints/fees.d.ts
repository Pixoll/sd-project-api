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
    get(_: import("express").Request<Record<string, string>, unknown, unknown, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<{
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
    }, Record<string, any>>): void;
};
