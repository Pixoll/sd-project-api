import { HTTPCode, Methods } from "./base";

export const methods = {
    /**
     * @name Send Ping
     * @description Check if the API is available.
     * @code 200 API is available.
     */
    get(_, response): void {
        response.send(HTTPCode.Ok).send();
    },
} satisfies Methods;
