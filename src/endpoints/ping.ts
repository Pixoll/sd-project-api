import { Endpoint } from "./base";

export class PingEndpoint extends Endpoint implements Endpoint.GetMethod {
    public constructor() {
        super("/ping");
    }

    /**
     * @name Send Ping
     * @description Check if the API is available.
     * @code 200 API is available.
     */
    public get(_: Endpoint.Request, response: Endpoint.Response): void {
        Endpoint.sendOk(response);
    }
}
