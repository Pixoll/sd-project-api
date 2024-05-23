import { Endpoint } from "./base";
import { Util } from "../util";
import fees from "../../static/fees.json";

export class FeesEndpoint extends Endpoint implements Endpoint.GetMethod {
    public static readonly fees = fees as Util.RecursiveReadonly<typeof fees>;

    public constructor() {
        super("/fees");
    }

    /**
     * @name Get Fees
     * @description Get a list of all applicable fees.
     * @response Contents of {file:/static/fees.json}.
     * @code 200 Successfully retrieved the fees list.
     */
    public get(_: Endpoint.Request, response: Endpoint.Response<typeof fees>): void {
        Endpoint.sendOk(response, fees);
    }
}
