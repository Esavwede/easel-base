"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiErrorHandler;
const logger_1 = __importDefault(require("../../../core/logging/logger"));
function apiErrorHandler(error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    const e = error;
    const { message, statusCode } = e;
    switch (statusCode) {
        case 401:
            return res.status(401).json({
                success: false,
                message,
            });
        case 429:
            return res.status(429).json({
                success: false,
                message,
            });
        case 500:
            return res.status(500).json({
                success: false,
                message,
            });
        default:
            logger_1.default.warn("UNKNOWN_SERVER_ERROR");
            logger_1.default.error(e);
            return res.status(500).json({ success: false, msg: "Server Error" });
    }
}
