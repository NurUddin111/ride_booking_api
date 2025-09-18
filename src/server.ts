import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { errorShutDown, gracefullShutDown } from "./app/utils/shutDown";

let server: Server;
const startServer = async () => {
  try {
    console.log("...Connecting to DB");
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to PORT ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Failed to run server. Error:", error);
  }
};

(async () => {
  await startServer();
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
