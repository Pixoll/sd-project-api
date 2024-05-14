/// <reference types="express" />
import { Admin } from "../db";
export declare const methods: {
    get(request: import("express").Request<Record<string, string>, unknown, unknown, {
        rut?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<Omit<Admin.JSON, "password" | "salt">, Record<string, any>>): Promise<void>;
};
export declare function hashPassword(password: string, salt: string): string;
