import { Endpoint } from "./base";
import { Shipment } from "../schemas/shipment";
export declare class ShipmentsEndpoint extends Endpoint implements Endpoint.GetMethod, Endpoint.PostMethod, Endpoint.DeleteMethod {
    constructor();
    get(request: Endpoint.Request<never, "id">, response: Endpoint.Response<Shipment.JSON>): Promise<void>;
    post(request: Endpoint.Request<Shipment.JSON>, response: Endpoint.Response): Promise<void>;
    delete(request: Endpoint.Request<never, "id">, response: Endpoint.Response): Promise<void>;
}
