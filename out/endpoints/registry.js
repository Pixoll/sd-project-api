"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersVerifyId = exports.UsersMeEndpoint = exports.UsersLoginEndpoint = exports.UsersEndpoint = exports.ShipmentsEndpoint = exports.RegionsEndpoint = exports.PingEndpoint = exports.FeesEndpoint = exports.AdminsLoginEndpoint = exports.AdminsEndpoint = exports.EndpointRegistry = void 0;
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
var admins_1 = require("./admins");
Object.defineProperty(exports, "AdminsEndpoint", { enumerable: true, get: function () { return admins_1.AdminsEndpoint; } });
var admins_login_1 = require("./admins_login");
Object.defineProperty(exports, "AdminsLoginEndpoint", { enumerable: true, get: function () { return admins_login_1.AdminsLoginEndpoint; } });
var fees_1 = require("./fees");
Object.defineProperty(exports, "FeesEndpoint", { enumerable: true, get: function () { return fees_1.FeesEndpoint; } });
var ping_1 = require("./ping");
Object.defineProperty(exports, "PingEndpoint", { enumerable: true, get: function () { return ping_1.PingEndpoint; } });
var regions_1 = require("./regions");
Object.defineProperty(exports, "RegionsEndpoint", { enumerable: true, get: function () { return regions_1.RegionsEndpoint; } });
var shipments_1 = require("./shipments");
Object.defineProperty(exports, "ShipmentsEndpoint", { enumerable: true, get: function () { return shipments_1.ShipmentsEndpoint; } });
var users_1 = require("./users");
Object.defineProperty(exports, "UsersEndpoint", { enumerable: true, get: function () { return users_1.UsersEndpoint; } });
var users_login_1 = require("./users_login");
Object.defineProperty(exports, "UsersLoginEndpoint", { enumerable: true, get: function () { return users_login_1.UsersLoginEndpoint; } });
var users_me_1 = require("./users_me");
Object.defineProperty(exports, "UsersMeEndpoint", { enumerable: true, get: function () { return users_me_1.UsersMeEndpoint; } });
var users_verify_id_1 = require("./users_verify_id");
Object.defineProperty(exports, "UsersVerifyId", { enumerable: true, get: function () { return users_verify_id_1.UsersVerifyId; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5kcG9pbnRzL3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFrQztBQUVsQyxNQUFhLGdCQUFpQixTQUFRLElBQUk7SUFDOUIsTUFBTSxDQUFVLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztJQUV2RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBa0I7UUFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQWtDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQWM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEMsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3hELElBQUksUUFBUSxDQUFDLEdBQUc7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLFFBQVEsQ0FBQyxJQUFJO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxRQUFRLENBQUMsR0FBRztnQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxDQUFDLEtBQUs7Z0JBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLFFBQVEsQ0FBQyxNQUFNO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7O0FBdEJMLDRDQXVCQztBQVdELG1DQUEwQztBQUFqQyx3R0FBQSxjQUFjLE9BQUE7QUFDdkIsK0NBQXFEO0FBQTVDLG1IQUFBLG1CQUFtQixPQUFBO0FBQzVCLCtCQUFzQztBQUE3QixvR0FBQSxZQUFZLE9BQUE7QUFDckIsK0JBQXNDO0FBQTdCLG9HQUFBLFlBQVksT0FBQTtBQUNyQixxQ0FBNEM7QUFBbkMsMEdBQUEsZUFBZSxPQUFBO0FBQ3hCLHlDQUFnRDtBQUF2Qyw4R0FBQSxpQkFBaUIsT0FBQTtBQUMxQixpQ0FBd0M7QUFBL0Isc0dBQUEsYUFBYSxPQUFBO0FBQ3RCLDZDQUFtRDtBQUExQyxpSEFBQSxrQkFBa0IsT0FBQTtBQUMzQix1Q0FBNkM7QUFBcEMsMkdBQUEsZUFBZSxPQUFBO0FBQ3hCLHFEQUFrRDtBQUF6QyxnSEFBQSxhQUFhLE9BQUEifQ==