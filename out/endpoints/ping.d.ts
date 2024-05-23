import { Endpoint } from "./base";
export declare class PingEndpoint extends Endpoint implements Endpoint.GetMethod {
    constructor();
    get(_: Endpoint.Request, response: Endpoint.Response): void;
}
