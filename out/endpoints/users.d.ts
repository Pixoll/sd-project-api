import { Endpoint } from "./base";
import { User } from "../db";
export declare class UsersEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    constructor();
    get(request: Endpoint.Request<NonNullable<unknown>, "rut" | "email" | "phone">, response: Endpoint.Response<Omit<User.JSON, "password" | "salt">>): Promise<void>;
    post(request: Endpoint.Request<User.JSON>, response: Endpoint.Response): Promise<void>;
    delete(request: Endpoint.Request, response: Endpoint.Response): Promise<void>;
    static hashPassword(password: string, salt: string): string;
}
