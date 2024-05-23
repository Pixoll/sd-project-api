"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointRegistry = void 0;
const base_1 = require("./base");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class EndpointRegistry extends null {
    static async registerEndpoints(router) {
        router.use(base_1.Endpoint.baseMiddleware);
        await Promise.all((0, fs_1.readdirSync)(__dirname).map(async (file) => {
            const { name, ext } = path_1.default.parse(file);
            if (ext !== ".js" || name === "base" || name === "registry")
                return;
            const endpointModule = await Promise.resolve(`${"./" + name}`).then(s => __importStar(require(s)));
            for (const [_, Value] of Object.entries(endpointModule)) {
                try {
                    const possibleEndpoint = new Value();
                    if (!(possibleEndpoint instanceof base_1.Endpoint))
                        continue;
                    const endpoint = possibleEndpoint;
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
                }
                catch (e) {
                }
            }
        }));
    }
}
exports.EndpointRegistry = EndpointRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaUNBQWtDO0FBQ2xDLDJCQUFpQztBQUNqQyxnREFBd0I7QUFFeEIsTUFBYSxnQkFBaUIsU0FBUSxJQUFJO0lBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBYztRQUNoRCxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBQSxnQkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDeEQsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxVQUFVO2dCQUFFLE9BQU87WUFFcEUsTUFBTSxjQUFjLEdBQUcseUJBQWEsSUFBSSxHQUFHLElBQUksdUNBQUMsQ0FBQztZQUNqRCxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNyQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsWUFBWSxlQUFRLENBQUM7d0JBQUUsU0FBUztvQkFFdEQsTUFBTSxRQUFRLEdBQUcsZ0JBQTBDLENBQUM7b0JBQzVELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBRTNCLElBQUksUUFBUSxDQUFDLEdBQUc7d0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxRQUFRLENBQUMsSUFBSTt3QkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLFFBQVEsQ0FBQyxHQUFHO3dCQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELElBQUksUUFBUSxDQUFDLEtBQUs7d0JBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxRQUFRLENBQUMsTUFBTTt3QkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUV4RCxPQUFPO2dCQUNYLENBQUM7Z0JBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFFYixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0NBQ0o7QUFuQ0QsNENBbUNDIn0=