import { Server } from "http";
import mongoose from "mongoose";

export const gracefullShutDown = (signal: string, server: Server) => {
  console.log(`${signal} signal received.Server shutting down...`);

  if (server) {
    server.close(() => {
      console.log("🛑 Server closed!!!");
      mongoose.connection.close(false);
      console.log("📦 MongoDB connection closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

export const errorShutDown = (signal: string, server: Server) => {
  console.log(`${signal} detected.Server shutting down...`);

  if (server) {
    server.close(() => {
      console.log("🛑 Server closed!!!");
      mongoose.connection.close(false);
      console.log("📦 MongoDB connection closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};
