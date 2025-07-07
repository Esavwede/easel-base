"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = server404ErrorHandler;
function server404ErrorHandler(req, res) {
    const error = {
        success: false,
        message: `Resource not found: ${req.method} ${req.originalUrl}`,
    };
    res.status(404).json(error);
}
