import { Router } from "express";
import { Endpoint } from "./base";
import { readdirSync } from "fs";
import path from "path";

export class EndpointRegistry extends null {
    public static async registerEndpoints(router: Router): Promise<void> {
        router.use(Endpoint.baseMiddleware);

        await Promise.all(readdirSync(__dirname).map(async (file) => {
            const { name, ext } = path.parse(file);
            if (ext !== ".js" || name === "base" || name === "registry") return;

            const endpointModule = await import("./" + name);
            for (const [_, Value] of Object.entries(endpointModule)) {
                try {
                    const possibleEndpoint = new Value();
                    if (!(possibleEndpoint instanceof Endpoint)) continue;

                    const endpoint = possibleEndpoint as EndpointWithAllMethods;
                    const path = endpoint.path;

                    if (endpoint.get)
                        router.get(path, endpoint.get.bind(endpoint));
                    if (endpoint.post)
                        router.post(path, endpoint.post.bind(endpoint));
                    if (endpoint.put)
                        router.put(path, endpoint.put.bind(endpoint));
                    if (endpoint.patch)
                        router.patch(path, endpoint.patch.bind(endpoint));
                    if (endpoint.delete)
                        router.delete(path, endpoint.delete.bind(endpoint));

                    return;
                } catch (e) {
                    //
                }
            }
        }));
    }
}

declare class EndpointWithAllMethods extends Endpoint implements Partial<Endpoint.AllMethods> {
    public constructor();
    public get?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public post?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public put?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public patch?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
    public delete?(request: Endpoint.Request, response: Endpoint.Response): void | Promise<void>;
}
