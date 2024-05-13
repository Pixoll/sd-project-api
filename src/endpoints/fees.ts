import { EndpointHandler, sendOk } from "./base";
import { RecursiveReadonly } from "../util";
import _fees from "../../static/fees.json";

export const fees = _fees as RecursiveReadonly<typeof _fees>;

export const methods = {
    /**
     * @name Get Fees
     * @description Get a list of all applicable fees.
     * @response Contents of {file:/static/fees.json}.
     * @code 200 Successfully retrieved the fees list.
     */
    get(_, response): void {
        sendOk(response, fees);
    },
} satisfies EndpointHandler<{
    get: {
        responseData: typeof fees;
    };
}>;
