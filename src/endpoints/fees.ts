import { readFileSync } from "fs";
import { Methods, sendOk } from "./base";
import path from "path";

export const fees = JSON.parse(readFileSync(
    path.join(__dirname, "../../static/fees.json"),
    "utf8"
)) as Readonly<Record<"shipping" | "extra" | "package_type", ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly fee: number;
}>>>;

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
} satisfies Methods;
