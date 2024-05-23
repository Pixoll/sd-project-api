import { Endpoint } from "./base";
import { Admin } from "../schemas/admin";
export declare class AdminsEndpoint extends Endpoint implements Endpoint.GetMethod {
    constructor();
    get(request: Endpoint.Request<never, "rut">, response: Endpoint.Response<Omit<Admin.JSON, "password" | "salt">>): Promise<void>;
}
