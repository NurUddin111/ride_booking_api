import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { errorShutDown, gracefullShutDown } from "./app/utils/shutDown";
import { connectRedis } from "./app/config/redis.config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;
const startServer = async () => {
  try {
    console.log("...Connecting to DB");
    await mongoose.connect(envVars.DB_URL);

    console.log("DB Connected!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to PORT ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to run server. Error:", error);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

// Termination Signals

process.on("SIGTERM", () => gracefullShutDown("SIGTERM", server));

process.on("SIGINT", () => gracefullShutDown("SIGTERM", server));

process.on("unhandledRejection", () =>
  errorShutDown("Unhandled Rejection", server)
);

process.on("uncaughtException", () =>
  errorShutDown("Uncaught Exception", server)
);
