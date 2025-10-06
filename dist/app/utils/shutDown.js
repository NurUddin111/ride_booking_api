"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorShutDown = exports.gracefullShutDown = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gracefullShutDown = (signal, server) => {
    console.log(`${signal} signal received.Server shutting down...`);
    if (server) {
        server.close(() => {
            console.log("🛑 Server closed!!!");
            mongoose_1.default.connection.close(false);
            console.log("📦 MongoDB connection closed.");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
exports.gracefullShutDown = gracefullShutDown;
const errorShutDown = (signal, server) => {
    console.log(`${signal} detected.Server shutting down...`);
    if (server) {
        server.close(() => {
            console.log("🛑 Server closed!!!");
            mongoose_1.default.connection.close(false);
            console.log("📦 MongoDB connection closed.");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
exports.errorShutDown = errorShutDown;
