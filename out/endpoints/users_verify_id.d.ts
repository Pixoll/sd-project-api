import { Endpoint } from "./base";
export declare class UsersVerifyId extends Endpoint implements Endpoint.PostMethod {
    private static readonly idUrlRegex;
    constructor();
    post(request: Endpoint.Request<{
        data?: string;
    }, "rut">, response: Endpoint.Response): Promise<void>;
}
