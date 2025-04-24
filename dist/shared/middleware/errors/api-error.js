"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.statusCode = statusCode;
    }
}
exports.default = ApiError;
