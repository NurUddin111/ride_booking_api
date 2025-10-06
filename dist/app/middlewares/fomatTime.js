"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bdTimePlugin = bdTimePlugin;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function bdTimePlugin(schema) {
    const formatDateToBD = (date) => {
        if (!date)
            return null;
        const m = (0, moment_timezone_1.default)(date).tz("Asia/Dhaka");
        return {
            date: m.format("YYYY-MM-DD"),
            time: m.format("hh:mm:ss A"),
        };
    };
    const transformDates = (doc, ret) => {
        for (const key in ret) {
            if (ret[key] instanceof Date) {
                ret[key] = formatDateToBD(ret[key]);
            }
        }
        return ret;
    };
    schema.set("toJSON", { transform: transformDates });
    schema.set("toObject", { transform: transformDates });
}
