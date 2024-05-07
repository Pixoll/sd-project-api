import { readFileSync } from "fs";
import { Methods, sendOk } from "./base";
import path from "path";

export const fees = JSON.parse(readFileSync(
    path.join(__dirname, "../../../static/fees.json"),
    "utf8"
)) as Readonly<Record<"regular" | "extra" | "package_type", ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly fee: number;
}>>>;

export const methods = {
    get(_, response): void {
        sendOk(response, fees);
    },
} satisfies Methods;
