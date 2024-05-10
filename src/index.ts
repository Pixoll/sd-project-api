import { config as dotenvConfig } from "dotenv";
import express from "express";
import { connect } from "./db";
import * as endpoints from "./endpoints";
import { Methods } from "./endpoints/base";

dotenvConfig();

const app = express();
app.use(express.json({
    limit: "1mb",
}));

// eslint-disable-next-line new-cap
const router = express.Router();

const PORT = +(process.env.PORT ?? 0) || 3000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("env.MONGO_URI must be specified");

void async function (): Promise<void> {
    await connect(MONGO_URI);

    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });

    for (const [endpoint, { methods }] of Object.entries(endpoints)) {
        for (const [name, handler] of Object.entries(methods as Required<Methods>)) {
            router[name]("/" + endpoint.replace(/__/g, "/"), handler);
        }
    }

    app.use("/api/v1", router);
}();
