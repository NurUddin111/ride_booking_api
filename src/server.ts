import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { shutDown } from "./app/utils/shutDown";
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
    console.error("Failed to start server:", error);
    shutDown("Startup Error", server, 1);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

//  Termination signals 
process.on("SIGTERM", () => shutDown("SIGTERM", server));
process.on("SIGINT", () => shutDown("SIGINT", server));

//  Fatal errors 
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutDown("Unhandled Rejection", server, 1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutDown("Uncaught Exception", server, 1);
});
