"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const app_1 = __importDefault(require("./app"));
const shutDown_1 = require("./app/utils/shutDown");
const redis_config_1 = require("./app/config/redis.config");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("...Connecting to DB");
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("DB Connected!");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening to PORT ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        (0, shutDown_1.shutDown)("Startup Error", server, 1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
//  Termination signals 
process.on("SIGTERM", () => (0, shutDown_1.shutDown)("SIGTERM", server));
process.on("SIGINT", () => (0, shutDown_1.shutDown)("SIGINT", server));
//  Fatal errors 
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    (0, shutDown_1.shutDown)("Unhandled Rejection", server, 1);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    (0, shutDown_1.shutDown)("Uncaught Exception", server, 1);
});
