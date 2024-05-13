import { NextFunction, Request, Response } from "express";
import { TokenType } from "../tokens";
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
export type MethodHandler<Params extends MethodHandlerGenerics | undefined = MethodHandlerGenerics> = (request: Request<Record<string, string | undefined>, unknown, MethodHandlerGenericsFallback<Params>["body"], {
    [K in MethodHandlerGenericsFallback<Params>["queryKeys"]]?: string;
}>, response: Response<MethodHandlerGenericsFallback<Params>["responseData"]>) => Promise<void> | void;
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
export declare enum HTTPCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    Conflict = 409,
    ContentTooLarge = 413,
    ServerError = 500
}
export declare function baseMiddleware(request: Request, response: Response, next: NextFunction): void;
type ResponseBodyType<R extends Response> = R extends Response<infer DT> ? DT : never;
type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;
export declare function sendOk<R extends Response>(response: R, ...[data]: IfUnknown<ResponseBodyType<R>, [], [data: ResponseBodyType<R>]>): void;
export declare function sendCreated(response: Response): void;
export declare function sendNoContent(response: Response): void;
export declare function sendError(response: Response, code: HTTPCode, message: string): void;
type AuthorizationData = {
    type: TokenType;
    rut: string;
};
export declare function getUserDataFromAuth(request: Request): AuthorizationData | null;
export {};
