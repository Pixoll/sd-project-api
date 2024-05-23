import { Endpoint } from "./base";
import regions from "../../static/regions_communes.json";
export declare class RegionsEndpoint extends Endpoint implements Endpoint.GetMethod {
    static readonly regions: readonly {
        readonly name: string;
        readonly communes: readonly string[];
    }[];
    constructor();
    get(_: Endpoint.Request, response: Endpoint.Response<typeof regions>): void;
}
