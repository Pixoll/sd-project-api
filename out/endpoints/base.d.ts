import { NextFunction, Request as ERequest, Response as EResponse } from "express";
import { TokenManager } from "../tokens";
export declare abstract class Endpoint {
    readonly path: string;
    constructor(path: string);
    static baseMiddleware(request: ERequest, response: EResponse, next: NextFunction): void;
    protected static sendOk<R extends EResponse>(response: R, ...[data]: IfUnknown<ResponseBodyType<R>, [], [data: ResponseBodyType<R>]>): void;
    protected static sendCreated(response: EResponse): void;
    protected static sendNoContent(response: EResponse): void;
    protected static sendError(response: EResponse, code: Endpoint.HTTPCode, message: string): void;
    protected static getAuthorizedUser(request: ERequest): AuthorizationData | null;
}
export declare namespace Endpoint {
    enum HTTPCode {
        Ok = 200,
        Created = 201,
        NoContent = 204,
        BadRequest = 400,
        Unauthorized = 401,
        NotFound = 404,
        Conflict = 409,
        ContentTooLarge = 413
    }
    type Request<Body extends object = {}, QueryKeys extends string = never> = ERequest<Record<string, string>, unknown, Body, {
        [K in QueryKeys]?: string;
    }>;
    type Response<Data = unknown> = EResponse<Data>;
    interface GetMethod {
        get(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }
    interface PostMethod {
        post(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }
    interface PutMethod {
        put(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }
    interface PatchMethod {
        patch(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }
    interface DeleteMethod {
        delete(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }
    interface AllMethods extends GetMethod, PostMethod, PutMethod, PatchMethod, DeleteMethod {
    }
}
type ResponseBodyType<R extends EResponse> = R extends EResponse<infer DT> ? DT : never;
type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;
type AuthorizationData = {
    type: TokenManager.TokenType;
    rut: string;
};
export {};
