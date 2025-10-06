"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const notFound_1 = require("./app/middlewares/notFound");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./app/config/env");
require("./app/config/passport");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
