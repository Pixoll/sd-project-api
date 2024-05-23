"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const registry_1 = require("./endpoints/registry");
const tokens_1 = require("./tokens");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json({
    limit: "1.3MB",
}));
const router = express_1.default.Router();
const PORT = +(process.env.PORT ?? 0) || 3000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
    throw new Error("env.MONGO_URI must be specified");
void async function () {
    tokens_1.TokenManager.loadTokens();
    console.log("Connecting to MongoDB...");
    await mongoose_1.default.connect(MONGO_URI, {
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    });
    await mongoose_1.default.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });
    await registry_1.EndpointRegistry.registerEndpoints(router);
    app.use("/api/v1", router);
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBZ0Q7QUFDaEQsc0RBQThCO0FBQzlCLG1EQUF3RDtBQUN4RCxxQ0FBd0M7QUFDeEMsd0RBQWdDO0FBRWhDLElBQUEsZUFBWSxHQUFFLENBQUM7QUFFZixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pCLEtBQUssRUFBRSxPQUFPO0NBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBR0osTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQzlDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3hDLElBQUksQ0FBQyxTQUFTO0lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBRW5FLEtBQUssS0FBSztJQUNOLHFCQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sa0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQzlCLFNBQVMsRUFBRTtZQUNQLE9BQU8sRUFBRSxHQUFHO1lBQ1osTUFBTSxFQUFFLElBQUk7WUFDWixpQkFBaUIsRUFBRSxJQUFJO1NBQzFCO0tBQ0osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXBDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSwyQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVqRCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDLEVBQUUsQ0FBQyJ9