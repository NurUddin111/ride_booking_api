"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const httpStatusCodes_1 = require("../utils/httpStatusCodes");
const notFound = (req, res) => {
    res.status(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Route Not Found",
    });
};
exports.notFound = notFound;
