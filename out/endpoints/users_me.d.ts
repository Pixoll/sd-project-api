import { Endpoint } from "./base";
import { User } from "../db";
export declare class UsersMeEndpoint extends Endpoint implements Endpoint.GetMethod {
    constructor();
    get(request: Endpoint.Request, response: Endpoint.Response<Omit<User.JSON, "password" | "salt">>): Promise<void>;
}
