import { EndpointHandler, sendOk } from "./base";

export const methods = {
    /**
     * @name Send Ping
     * @description Check if the API is available.
     * @code 200 API is available.
     */
    get(_, response): void {
        sendOk(response);
    },
} satisfies EndpointHandler;
