import { Request, Response } from "express";
type MethodHandler = (request: Request, response: Response) => Promise<void> | void;
type RequireAtLeastOne<T extends object> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
export type Methods = RequireAtLeastOne<{
    get: MethodHandler;
    post: MethodHandler;
    put: MethodHandler;
    delete: MethodHandler;
    patch: MethodHandler;
}>;
export declare enum HTTPCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    Conflict = 409,
    ServerError = 500
}
export declare function sendOk(response: Response, data?: unknown): void;
export declare function sendCreated(response: Response): void;
export declare function sendNoContent(response: Response): void;
export declare function sendError(response: Response, code: HTTPCode, message: string): void;
export {};
