import { Router } from "express";
import { Endpoint } from "./base";
export declare class EndpointRegistry extends null {
    private static readonly endpoints;
    static registerEndpoint(endpoint: Endpoint): void;
    static registerEndpoints(router: Router): void;
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
