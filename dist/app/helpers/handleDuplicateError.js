"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const httpStatusCodes_1 = require("../utils/httpStatusCodes");
const handleDuplicateError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return {
        statusCode: httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
        message: `${value} already exists.`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
