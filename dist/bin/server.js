"use strict";
// import { createTerminus } from "@godaddy/terminus";
// import * as net from "net";
// import app from "../app";
// import http from "http";
// import { Application } from "express";
// const server = http.createServer(app);
// const connections = new Set<net.Socket>();
// const PORT = normalizePort(process.env.PORT || "3000");
// app.set("port", PORT);
// server.on("listening", onListening);
// server.on("error", onError);
// server.on("connection", (connection) => {
//   connections.add(connection);
//   connection.on("close", () => {
//     connections.delete(connection);
//   });
// });
// const terminusOptions = {
//   signals: ["SIGINT", "SIGTERM"],
//   healthChecks: {
//     "/health": () => Promise.resolve("UP"),
//   },
//   onSignal: gracefulShutDown,
//   onShutdown: async () => {
//     console.log("Cleanup finished, shutting down gracefully");
//   },
//   timeout: 15000,
// };
// async function gracefulShutDown() {
//   console.log("Attempting Graceful Shutdown...");
//   for (const connection of connections) {
//     connection.end();
//   }
//   try {
//     console.log("Closing Database Connections...");
//     console.log("Database Connections closed");
//   } catch (e: any) {
//     console.error("Graceful Shutdown failed", e);
//   }
//   console.log("Graceful Shutdown complete");
// }
// async function startServer() {
//   try {
//     // Connect to database
//     createTerminus(server, terminusOptions);
//     server.listen(PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT || 3000}`);
//     });
//   } catch (e: any) {
//     console.log("Error starting server", e);
//     process.exit(1);
//   }
// }
// /**
//  * Normalize a port into a number, string, or false.
//  */
// function normalizePort(val: any) {
//   const port = parseInt(val, 10);
//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }
//   if (port >= 0) {
//     // port number
//     return port;
//   }
//   return false;
// }
// /**
//  * Event listener for HTTP server "error" event.
//  */
// function onError(error: any) {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case "EACCES":
//       console.error(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
// function onListening() {
//   const addr = server.address();
//   const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
//   console.log(`server listening on PORT: ${PORT}`);
// }
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });
// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
//   process.exit(1);
// });
// startServer();
// class Server {
//   private app: Application
//   private PORT: number | string | boolean;
//   private server: any; // http.Server;
//   private connections: Set<net.Socket>;
//   private terminusOptions: any; // TerminusOptions;
//   private gracefulShutDown: () => Promise<void>;
//   private onSignal: () => Promise<void>;
//   private onShutdown: () => Promise<void>;
//   private onError: (error: any) => void;
//   private onListening: () => void;
//   private normalizePort: (val: any) => number | string | boolean;
//   private startServer: () => Promise<void>;
//   private constructor: () => void;
//   constructor() {
//     this.app = app
//   }
//   setPort(val: any) {
//   }
//   normalizePort(val: any) {
//   }
//   initialize()
//   {
//     this.server = http.createServer(this.app);
//   }
//   addEventListeners()
//   {
//     this.server.on("listenting", this.onListening);
//     this.server.on("error", this.onError);
//   }
//   start()
//   {
//   }
// }
