import { Request, Response } from "express";

type MethodHandler = (request: Request, response: Response) => Promise<void> | void;

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone
 */
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

export enum HTTPCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    Conflict = 409,
    ContentTooLarge = 413,
    ServerError = 500,
}

export function sendOk(response: Response, data?: unknown): void {
    response.status(HTTPCode.Ok).send(data);
}

export function sendCreated(response: Response): void {
    response.status(HTTPCode.Created).send();
}

export function sendNoContent(response: Response): void {
    response.status(HTTPCode.NoContent).send();
}

export function sendError(response: Response, code: HTTPCode, message: string): void {
    response.status(code).send({ status: code, message });
}
