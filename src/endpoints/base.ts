import { NextFunction, Request as ERequest, Response as EResponse } from "express";
import { TokenManager } from "../tokens";
import { Util } from "../util";

export abstract class Endpoint {
    public constructor(public readonly path: string) {
        this.path = path[0] === "/" ? path : "/" + path;
    }

    public static baseMiddleware(request: ERequest, response: EResponse, next: NextFunction): void {
        const now = new Date().toISOString().replace(/T|\.\d{3}Z$/g, " ").trim();
        const method = request.method as Method;
        console.log(`[${now}] ${method} ${request.path}`, Util.pick(request, ["query", "body"]));

        if (method === "POST" && request.headers["content-type"] !== "application/json") {
            Endpoint.sendError(response, Endpoint.HTTPCode.BadRequest, "Content-Type header must be 'application/json'.");
            return;
        }

        next();
    }

    protected static sendOk<R extends EResponse>(
        response: R,
        ...[data]: IfUnknown<ResponseBodyType<R>, [], [data: ResponseBodyType<R>]>
    ): void {
        response.status(Endpoint.HTTPCode.Ok).send(data);
    }

    protected static sendCreated(response: EResponse): void {
        response.status(Endpoint.HTTPCode.Created).send();
    }

    protected static sendNoContent(response: EResponse): void {
        response.status(Endpoint.HTTPCode.NoContent).send();
    }

    protected static sendError(response: EResponse, code: Endpoint.HTTPCode, message: string): void {
        response.status(code).send({ status: code, message });
    }

    protected static getAuthorizedUser(request: ERequest): AuthorizationData | null {
        const token = request.headers.authorization;
        if (!token) return null;

        for (const type of ["admin", "user"] satisfies TokenManager.TokenType[]) {
            const rut = TokenManager.getRutFromToken(type, token);
            if (rut) {
                return { type, rut };
            }
        }

        return null;
    }
}

export namespace Endpoint {
    export enum HTTPCode {
        Ok = 200,
        Created = 201,
        NoContent = 204,
        BadRequest = 400,
        Unauthorized = 401,
        NotFound = 404,
        Conflict = 409,
        ContentTooLarge = 413,
    }

    export type Request<Body extends object = NonNullable<unknown>, QueryKeys extends string = never> = ERequest<
        Record<string, string>,
        unknown,
        Body,
        { [K in QueryKeys]?: string }
    >;

    export type Response<Data = unknown> = EResponse<Data>;

    export interface GetMethod {
        get(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }

    export interface PostMethod {
        post(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }

    export interface PutMethod {
        put(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }

    export interface PatchMethod {
        patch(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }

    export interface DeleteMethod {
        delete(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    }

    export interface AllMethods extends GetMethod, PostMethod, PutMethod, PatchMethod, DeleteMethod { }
}

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ResponseBodyType<R extends EResponse> = R extends EResponse<infer DT> ? DT : never;

type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;

type AuthorizationData = {
    type: TokenManager.TokenType;
    rut: string;
};
