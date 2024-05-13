import { config as dotenvConfig } from "dotenv";
import express from "express";
import { connect } from "./db";
import * as endpoints from "./endpoints";
import { loadTokens } from "./tokens";
import { omit } from "./util";

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
    loadTokens();
    await connect(MONGO_URI);

    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });

    router.use(endpoints.baseMiddleware);

    for (const [endpoint, { methods }] of Object.entries(omit(endpoints, ["baseMiddleware"]))) {
        for (const [name, handler] of Object.entries(methods as Required<endpoints.Methods>)) {
            router[name]("/" + endpoint.replace(/__/g, "/"), handler);
        }
    }

    app.use("/api/v1", router);
}();
