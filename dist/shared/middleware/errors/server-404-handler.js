"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = server404ErrorHandler;
function server404ErrorHandler(req, res) {
    const error = {
        status: "error",
        code: 404,
        message: `Resource not found: ${req.method} ${req.originalUrl}`,
        details: "The requested endpoint does not exist or the resource is unavailable.",
    };
    console.log("404 Error");
    console.dir(error);
    res.status(404).json(error);
}
