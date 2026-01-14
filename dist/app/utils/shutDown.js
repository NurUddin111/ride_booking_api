"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutDown = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isShuttingDown = false;
const shutDown = (signal, server, exitCode = 0) => {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    console.log(`${signal} received. Server shutting down...`);
    if (server) {
        server.close(() => {
            console.log("🛑 Server closed");
            mongoose_1.default.connection.close(false).then(() => {
                console.log("📦 MongoDB connection closed");
                process.exit(exitCode);
            });
        });
    }
    else {
        process.exit(exitCode);
    }
};
exports.shutDown = shutDown;
