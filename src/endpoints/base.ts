import { Request, Response } from "express";

type EndpointHandler = (request: Request, response: Response) => Promise<void> | void;

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone
 */
type RequireAtLeastOne<T extends object> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type Methods = RequireAtLeastOne<{
    get: EndpointHandler;
    post: EndpointHandler;
    put: EndpointHandler;
    delete: EndpointHandler;
    patch: EndpointHandler;
}>;

export function sendOk<D>(response: Response, data?: D): void {
    response.status(200).send(data);
}

export function sendCreated(response: Response): void {
    response.status(201).send();
}

export function sendNoContent(response: Response): void {
    response.status(204).send();
}

function sendError(response: Response, code: number, message: string): void {
    response.status(code).send({ status: code, message });
}

export function sendBadRequest(response: Response, message: string): void {
    sendError(response, 400, message);
}

export function sendNotFound(response: Response, message: string): void {
    sendError(response, 404, message);
}

export function sendConflict(response: Response, message: string): void {
    sendError(response, 409, message);
}

export function sendServerError(response: Response, message: string): void {
    sendError(response, 500, message);
}
