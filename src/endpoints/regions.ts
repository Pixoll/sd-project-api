import { Endpoint } from "./base";
import { Util } from "../util";
import regions from "../../static/regions_communes.json";

export class RegionsEndpoint extends Endpoint implements Endpoint.GetMethod {
    public static readonly regions = regions as Util.RecursiveReadonly<typeof regions>;

    public constructor() {
        super("/regions");
    }

    /**
     * @name Get Regions
     * @description Get a list of all regions in the country alongside all their communes.
     * @response Contents of {file:/static/regions_communes.json}.
     * @code 200 Successfully retrieved the regions list.
     */
    public get(_: Endpoint.Request, response: Endpoint.Response<typeof regions>): void {
        Endpoint.sendOk(response, regions);
    }
}
