"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.data = {};
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ApiError;
