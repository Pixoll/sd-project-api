import { Endpoint } from "./base";
export declare class UsersLoginEndpoint extends Endpoint implements Endpoint.PostMethod {
    constructor();
    post(request: Endpoint.Request<{
        email: string;
        password: string;
    }>, response: Endpoint.Response<{
        session_token: string;
    }>): Promise<void>;
}
