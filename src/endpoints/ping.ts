import { Methods, sendOk } from "./base";

export const methods = {
    get(_, response): void {
        sendOk(response);
    },
} satisfies Methods;
