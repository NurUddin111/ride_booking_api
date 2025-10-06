"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCodes = void 0;
/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
var HttpStatusCodes;
(function (HttpStatusCodes) {
    // ✅ Success
    HttpStatusCodes[HttpStatusCodes["OK"] = http_status_codes_1.default.OK] = "OK";
    HttpStatusCodes[HttpStatusCodes["CREATED"] = http_status_codes_1.default.CREATED] = "CREATED";
    HttpStatusCodes[HttpStatusCodes["NO_CONTENT"] = http_status_codes_1.default.NO_CONTENT] = "NO_CONTENT";
    // ⚠️ Client errors
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = http_status_codes_1.default.BAD_REQUEST] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["UNAUTHORIZED"] = http_status_codes_1.default.UNAUTHORIZED] = "UNAUTHORIZED";
    HttpStatusCodes[HttpStatusCodes["FORBIDDEN"] = http_status_codes_1.default.FORBIDDEN] = "FORBIDDEN";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = http_status_codes_1.default.NOT_FOUND] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["CONFLICT"] = http_status_codes_1.default.CONFLICT] = "CONFLICT";
    // 🔥 Server errors
    HttpStatusCodes[HttpStatusCodes["INTERNAL_SERVER_ERROR"] = http_status_codes_1.default.INTERNAL_SERVER_ERROR] = "INTERNAL_SERVER_ERROR";
    HttpStatusCodes[HttpStatusCodes["SERVICE_UNAVAILABLE"] = http_status_codes_1.default.SERVICE_UNAVAILABLE] = "SERVICE_UNAVAILABLE";
})(HttpStatusCodes || (exports.HttpStatusCodes = HttpStatusCodes = {}));
