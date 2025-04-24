"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const corsConfig = {
    origin: (origin, callback) => {
        if (!origin ||
            config_1.default.get("cors.allowedOrigins").includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Origin not allowed by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: config_1.default.get("cors.methods"),
    allowedHeaders: config_1.default.get("cors.allowedHeaders"),
    credentials: config_1.default.get("cors.credentials"),
    maxAge: config_1.default.get("cors.maxAge"),
};
exports.default = (0, cors_1.default)(corsConfig);
