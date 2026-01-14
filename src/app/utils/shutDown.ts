import { Server } from "http";
import mongoose from "mongoose";

let isShuttingDown = false;

export const shutDown = (signal: string, server?: Server, exitCode = 0) => {
  if (isShuttingDown) return; 

  isShuttingDown = true;
  console.log(`${signal} received. Server shutting down...`);

  if (server) {
    server.close(() => {
      console.log("🛑 Server closed");
      mongoose.connection.close(false).then(() => {
        console.log("📦 MongoDB connection closed");
        process.exit(exitCode);
      });
    });
  } else {
    process.exit(exitCode);
  }
};
