"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const httpStatusCodes_1 = require("../utils/httpStatusCodes");
const handleCastError = (err) => {
    return {
        statusCode: httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
        message: `Cast Error:${err.message}`,
    };
};
exports.handleCastError = handleCastError;
