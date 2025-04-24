"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./shared/middleware/security/cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const server_404_handler_1 = __importDefault(require("./shared/middleware/errors/server-404-handler"));
const api_error_handler_1 = __importDefault(require("./shared/middleware/errors/api-error-handler"));
const api_error_1 = __importDefault(require("./shared/middleware/errors/api-error"));
const app = (0, express_1.default)();
// Security
app.use(cors_1.default);
app.use((0, helmet_1.default)());
// Performance
app.use((0, compression_1.default)());
// Request Parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health checks
app.get("/health", (req, res) => {
    throw new api_error_1.default("Forced Server Error", 500);
    res.status(200).json({ status: "UP" });
});
// Error Handlers
app.use(server_404_handler_1.default);
app.use(api_error_handler_1.default);
exports.default = app;
