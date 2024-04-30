import mongoose from "mongoose";

let connected = false;

export async function connect(uri: string): Promise<void> {
    if (connected) {
        console.log("Already connected to MongoDB");
        return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");

    connected = true;
}
