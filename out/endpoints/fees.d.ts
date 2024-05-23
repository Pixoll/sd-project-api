import { Endpoint } from "./base";
import fees from "../../static/fees.json";
export declare class FeesEndpoint extends Endpoint implements Endpoint.GetMethod {
    static readonly fees: {
        readonly shipping: readonly {
            readonly id: string;
            readonly name: string;
            readonly fee: number;
        }[];
        readonly extra: readonly {
            readonly id: string;
            readonly name: string;
            readonly fee: number;
        }[];
        readonly package_type: readonly {
            readonly id: string;
            readonly name: string;
            readonly fee: number;
        }[];
    };
    constructor();
    get(_: Endpoint.Request, response: Endpoint.Response<typeof fees>): void;
}
