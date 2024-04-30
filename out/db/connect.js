"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let connected = false;
async function connect(uri) {
    if (connected) {
        console.log("Already connected to MongoDB");
        return;
    }
    console.log("Connecting to MongoDB...");
    await mongoose_1.default.connect(uri, {
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    });
    await mongoose_1.default.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");
    connected = true;
}
exports.connect = connect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYi9jb25uZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUFnQztBQUVoQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFFZixLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQVc7SUFDckMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM1QyxPQUFPO0lBQ1gsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUN4QyxNQUFNLGtCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUN4QixTQUFTLEVBQUU7WUFDUCxPQUFPLEVBQUUsR0FBRztZQUNaLE1BQU0sRUFBRSxJQUFJO1lBQ1osaUJBQWlCLEVBQUUsSUFBSTtTQUMxQjtLQUNKLENBQUMsQ0FBQztJQUNILE1BQU0sa0JBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUVwQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLENBQUM7QUFsQkQsMEJBa0JDIn0=