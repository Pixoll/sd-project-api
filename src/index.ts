import { config as dotenvConfig } from "dotenv";
import express from "express";
import { EndpointRegistry } from "./endpoints/registry";
import { TokenManager } from "./tokens";
import mongoose from "mongoose";

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

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });

    await EndpointRegistry.registerEndpoints(router);

    app.use("/api/v1", router);
}();
