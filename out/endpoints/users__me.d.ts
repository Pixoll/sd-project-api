/// <reference types="express" />
import { User } from "../db";
export declare const methods: {
    get(request: import("express").Request<Record<string, string>, unknown, unknown, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<Omit<User.JSON, "password" | "salt">, Record<string, any>>): Promise<void>;
};
