import { Methods, sendOk } from "./base";
import { RecursiveReadonly } from "../util";
import _regions from "../../static/regions_communes.json";

export const regions = _regions as RecursiveReadonly<typeof _regions>;

export const methods = {
    /**
     * @name Get Regions
     * @description Get a list of all regions in the country alongside all their communes.
     * @response Contents of {file:/static/regions_communes.json}.
     * @code 200 Successfully retrieved the regions list.
     */
    get(_, response): void {
        sendOk(response, regions);
        return;
    },
} satisfies Methods;
