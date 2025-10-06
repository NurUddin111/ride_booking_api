"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const httpStatusCodes_1 = require("../utils/httpStatusCodes");
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
    }));
    return {
        statusCode: httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
        message: "Validation Error",
        errorSources,
    };
};
exports.handleValidationError = handleValidationError;
