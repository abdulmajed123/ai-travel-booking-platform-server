import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function main() {
  try {
    await mongoose.connect(config.database_url || "");
    console.log("MongoDB connected");

    app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

main();
