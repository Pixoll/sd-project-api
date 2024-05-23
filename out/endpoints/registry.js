"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointRegistry = void 0;
const base_1 = require("./base");
class EndpointRegistry extends null {
    static endpoints = new Map();
    static registerEndpoint(endpoint) {
        EndpointRegistry.endpoints.set(endpoint.path, endpoint);
    }
    static registerEndpoints(router) {
        router.use(base_1.Endpoint.baseMiddleware);
        for (const [path, endpoint] of EndpointRegistry.endpoints) {
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
        }
    }
}
exports.EndpointRegistry = EndpointRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFrQztBQUVsQyxNQUFhLGdCQUFpQixTQUFRLElBQUk7SUFDOUIsTUFBTSxDQUFVLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztJQUV2RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBa0I7UUFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQWtDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQWM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEMsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3hELElBQUksUUFBUSxDQUFDLEdBQUc7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLFFBQVEsQ0FBQyxJQUFJO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxRQUFRLENBQUMsR0FBRztnQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxDQUFDLEtBQUs7Z0JBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLFFBQVEsQ0FBQyxNQUFNO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7O0FBdEJMLDRDQXVCQyJ9