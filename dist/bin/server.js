"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
const terminus_1 = require("@godaddy/terminus");
class Server {
    constructor() {
        this.connections = new Set();
        this.port = config_1.default.get("app.port") || 3000;
        app_1.default.set("port", this.port);
        this.server = http_1.default.createServer(app_1.default);
        this.initializeTerminus();
        this.listen();
    }
    normalizePort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val; // Named pipe
        }
        if (port >= 0) {
            return port; // Port number
        }
        return false;
    }
    listen() {
        this.server.on("connection", (connection) => {
            this.connections.add(connection);
            connection.on("close", () => {
                this.connections.delete(connection);
            });
        });
        this.server.listen(this.port);
        this.server.on("error", this.onError.bind(this));
        this.server.on("listening", this.onListening.bind(this));
    }
    onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = typeof this.port === "string" ? `Pipe ${this.port}` : `Port ${this.port}`;
        // Friendly error messages
        switch (error.code) {
            case "EACCES":
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    onListening() {
        const addr = this.server.address();
        const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
        console.log(`Server listening on ${bind}`);
    }
    initializeTerminus() {
        const terminusConfig = {
            signals: ["SIGINT", "SIGTERM"],
            onSignal: this.shutDownGracefully.bind(this),
            onShutDown: () => {
                console.log("Terminus: Shutdown Successfully");
            },
            timeout: 15000,
        };
        (0, terminus_1.createTerminus)(this.server, terminusConfig);
    }
    shutDownGracefully() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Closing Server Gracefully...");
                for (const connection of this.connections) {
                    connection.end();
                }
                console.log("closing Database");
                console.log("Database Closed");
                console.log("Graceful Shutdown successful");
            }
            catch (e) {
                console.log("Graceful Shutdown Failed");
                process.exit(1);
            }
        });
    }
}
// Start the server
new Server();
