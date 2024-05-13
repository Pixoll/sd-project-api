import { NextFunction, Request, Response } from "express";
import { TokenType, getRutFromToken } from "../tokens";

type MethodHandlerGenerics = {
    body?: unknown;
    queryKeys?: string;
    responseData?: unknown;
};
type MethodHandlerGenericsFallback<T extends MethodHandlerGenerics | undefined> = {
    body: T extends MethodHandlerGenerics ? T["body"] : unknown;
    queryKeys: T extends MethodHandlerGenerics ? T["queryKeys"] & string : string;
    responseData: T extends MethodHandlerGenerics ? T["responseData"] : unknown;
};
export type MethodHandler<Params extends MethodHandlerGenerics | undefined = MethodHandlerGenerics> = (
    request: Request<Record<string, string>, unknown, MethodHandlerGenericsFallback<Params>["body"], {
        [K in MethodHandlerGenericsFallback<Params>["queryKeys"]]?: string
    }>,
    response: Response<MethodHandlerGenericsFallback<Params>["responseData"]>
) => Promise<void> | void;

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone
 */
type RequireAtLeastOne<T extends object> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type EndpointHandlerGenerics = Partial<Record<Lowercase<Method>, MethodHandlerGenerics>>;

export type EndpointHandler<Generics extends EndpointHandlerGenerics = EndpointHandlerGenerics> = RequireAtLeastOne<{
    get: MethodHandler<Generics["get"]>;
    post: MethodHandler<Generics["post"]>;
    put: MethodHandler<Generics["put"]>;
    delete: MethodHandler<Generics["delete"]>;
    patch: MethodHandler<Generics["patch"]>;
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

export function baseMiddleware(request: Request, response: Response, next: NextFunction): void {
    console.log(request.params);
    const method = request.method as Method;
    if (method === "POST" && request.headers["content-type"] !== "application/json") {
        sendError(response, HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
        return;
    }

    next();
}

type ResponseBodyType<R extends Response> = R extends Response<infer DT> ? DT : never;
type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;

export function sendOk<R extends Response>(
    response: R,
    ...[data]: IfUnknown<ResponseBodyType<R>, [], [data: ResponseBodyType<R>]>
): void {
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

type AuthorizationData = {
    type: TokenType;
    rut: string;
};

export function getAuthorizedUser(request: Request): AuthorizationData | null {
    const token = request.headers.authorization;
    if (!token) return null;

    for (const type of ["admin", "user"] satisfies TokenType[]) {
        const rut = getRutFromToken(type, token);
        if (rut) {
            return { type, rut };
        }
    }

    return null;
}
