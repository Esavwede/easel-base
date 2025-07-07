"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("./shared/middleware/security/cors"));
const server_404_handler_1 = __importDefault(require("./shared/middleware/errors/server-404-handler"));
const api_error_handler_1 = __importDefault(require("./shared/middleware/errors/api-error-handler"));
const routes_v1_1 = __importDefault(require("./versions/v1/modules/routes.v1"));
const http_logger_1 = __importDefault(require("./shared/middleware/logging/http-logger"));
const request_1 = require("./shared/middleware/request/request");
const app = (0, express_1.default)();
// Security
app.use(cors_1.default);
app.use((0, helmet_1.default)());
// Performance
app.use((0, compression_1.default)());
// Request Parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging
app.use(request_1.ensureRequestIdInRequest);
app.use(http_logger_1.default);
// Versioned Routes
(0, routes_v1_1.default)(app);
// Health checks
app.get("/health", (req, res) => {
    const logger = req.log.child({ contextualDetail: "contextual detail" });
    logger.info("");
    res.status(200).json({ status: "UP" });
});
// Error Handlers
app.use(server_404_handler_1.default);
app.use(api_error_handler_1.default);
exports.default = app;
