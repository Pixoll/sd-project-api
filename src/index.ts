import { config as dotenvConfig } from "dotenv";
import express from "express";
import { connect } from "./db";
import { EndpointRegistry } from "./endpoints/registry";
import { TokenManager } from "./tokens";

dotenvConfig();

const app = express();
app.use(express.json({
    limit: "1.3MB",
}));

// eslint-disable-next-line new-cap
const router = express.Router();

const PORT = +(process.env.PORT ?? 0) || 3000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("env.MONGO_URI must be specified");

void async function (): Promise<void> {
    TokenManager.loadTokens();
    await connect(MONGO_URI);

    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });

    await EndpointRegistry.registerEndpoints(router);

    app.use("/api/v1", router);
}();
