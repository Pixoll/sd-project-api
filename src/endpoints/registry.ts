import { Router } from "express";
import { Endpoint } from "./base";

export class EndpointRegistry extends null {
    private static readonly endpoints = new Map<string, EndpointWithAllMethods>();

    public static registerEndpoint(endpoint: Endpoint): void {
        EndpointRegistry.endpoints.set(endpoint.path, endpoint as EndpointWithAllMethods);
    }

    public static registerEndpoints(router: Router): void {
        router.use(Endpoint.baseMiddleware);

        for (const [path, endpoint] of EndpointRegistry.endpoints) {
            if (endpoint.get)
                router.get(path, endpoint.get.bind(endpoint));
            if (endpoint.post)
                router.post(path, endpoint.post.bind(endpoint));
            if (endpoint.put)
                router.put(path, endpoint.put.bind(endpoint));
            if (endpoint.patch)
                router.patch(path, endpoint.patch.bind(endpoint));
            if (endpoint.delete)
                router.delete(path, endpoint.delete.bind(endpoint));
        }
    }
}

declare class EndpointWithAllMethods extends Endpoint implements Partial<Endpoint.AllMethods> {
    public constructor();
    public get?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public post?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public put?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public patch?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public delete?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
}

export { AdminsEndpoint } from "./admins";
export { AdminsLoginEndpoint } from "./admins_login";
export { FeesEndpoint } from "./fees";
export { PingEndpoint } from "./ping";
export { RegionsEndpoint } from "./regions";
export { ShipmentsEndpoint } from "./shipments";
export { UsersEndpoint } from "./users";
export { UsersLoginEndpoint } from "./users_login";
export { UsersMeEndpoint } from "./users_me";
export { UsersVerifyId } from "./users_verify_id";
