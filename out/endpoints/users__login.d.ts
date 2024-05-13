/// <reference types="express" />
export declare const methods: {
    post(request: import("express").Request<Record<string, string>, unknown, {
        email: string;
        password: string;
    }, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<{
        session_token: string;
    }, Record<string, any>>): Promise<void>;
};
