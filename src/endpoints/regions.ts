import { readFileSync } from "fs";
import { Methods, sendOk } from "./base";
import path from "path";

export const regions = JSON.parse(readFileSync(
    path.join(__dirname, "../../static/regions_communes.json"),
    "utf-8"
)) as ReadonlyArray<{
    readonly name: string;
    readonly communes: readonly string[];
}>;

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
