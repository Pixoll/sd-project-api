/// <reference types="express" />
import { Shipment } from "../db";
export declare const methods: {
    get(request: import("express").Request<Record<string, string>, unknown, unknown, {
        id?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<Shipment.JSON, Record<string, any>>): Promise<void>;
    post(request: import("express").Request<Record<string, string>, unknown, Shipment.JSON, {
        [x: string]: string | undefined;
    }, Record<string, any>>, response: import("express").Response<unknown, Record<string, any>>): Promise<void>;
    delete(request: import("express").Request<Record<string, string>, unknown, unknown, {
        id?: string | undefined;
    }, Record<string, any>>, response: import("express").Response<unknown, Record<string, any>>): Promise<void>;
};
