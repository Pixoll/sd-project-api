import { Router } from "express";
import { Endpoint } from "./base";
export declare class EndpointRegistry extends null {
    private static readonly endpoints;
    static registerEndpoint(endpoint: Endpoint): void;
    static registerEndpoints(router: Router): void;
}
