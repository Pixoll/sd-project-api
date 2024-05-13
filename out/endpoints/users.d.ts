/// <reference types="express" />
import { User } from "../db";
export declare const methods: {
    get(request: import("express").Request<Record<string, string | undefined>, unknown, unknown, {
        rut?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<Omit<User.JSON, "password" | "salt">, Record<string, any>>): Promise<void>;
    post(request: import("express").Request<Record<string, string | undefined>, unknown, User.JSON, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<unknown, Record<string, any>>): Promise<void>;
    delete(request: import("express").Request<Record<string, string | undefined>, unknown, unknown, {
        rut?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<unknown, Record<string, any>>): Promise<void>;
};
export declare function hashPassword(password: string, salt: string): string;
