/// <reference types="express" />
export declare const methods: {
    post(request: import("express").Request<Record<string, string | undefined>, unknown, {
        data?: string | undefined;
    }, {
        rut?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<unknown, Record<string, any>>): Promise<void>;
};
