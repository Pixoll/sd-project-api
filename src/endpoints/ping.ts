import { Methods, sendOk } from "./base";

export const methods = {
    get(_, response, next): void {
        sendOk(response);
        next();
    },
} satisfies Methods;
