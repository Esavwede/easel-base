"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiErrorHandler;
const crypto_1 = __importDefault(require("crypto"));
function apiErrorHandler(error, req, res, next) {
    const e = error;
    let response = undefined;
    switch (e.statusCode) {
        case 404:
            response = {
                status: "error",
                code: 404,
                message: `Resource not found: ${req.method} ${req.originalUrl}`,
                details: e.message,
            };
            return res.status(400).json(response);
        case 500:
            let correlationId = req.get("X-Correlation-ID") || crypto_1.default.randomUUID();
            response = {
                status: "error",
                code: 500,
                message: "Internal Server Error",
                correlationId,
                details: e.message,
            };
            return res.status(500).json(response);
        default:
            // Unknown Server Error
            response = {
                status: "error",
                code: 500,
                message: "Internal Server Error",
                correlationId: req.get("X-Correlation-ID") || crypto_1.default.randomUUID(),
                details: "An unexpected error occurred with server: " + e.message,
            };
            console.log("FATAL: UNKNOWN SERVER ERROR");
            return res.status(500).json(response);
    }
}
