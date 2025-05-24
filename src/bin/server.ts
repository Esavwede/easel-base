import config from "config"
import http from "http"
import * as net from "net"
import { createTerminus } from "@godaddy/terminus"
import app from "../app"
import startDatabase from "../core/database/database"

class Server {
  private port: number | string | boolean

  private server: http.Server

  private connections: Set<net.Socket>

  constructor() {
    this.connections = new Set()
    this.port = config.get<number>("app.port") || 3000
    app.set("port", this.port)

    this.server = http.createServer(app)
    startDatabase()
    this.initializeTerminus()
    this.listen()
  }

  private normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
      return val // Named pipe
    }
    if (port >= 0) {
      return port // Port number
    }
    return false
  }

  private listen(): void {
    this.server.on("connection", (connection) => {
      this.connections.add(connection)
      connection.on("close", () => {
        this.connections.delete(connection)
      })
    })
    this.server.listen(this.port)
    this.server.on("error", this.onError.bind(this))
    this.server.on("listening", this.onListening.bind(this))
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error
    }

    const bind =
      typeof this.port === "string" ? `Pipe ${this.port}` : `Port ${this.port}`

    // Friendly error messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  }

  private onListening(): void {
    const addr = this.server.address()
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`
    console.log(`Server listening on ${bind}`)
  }

  private initializeTerminus() {
    const terminusConfig = {
      signals: ["SIGINT", "SIGTERM"],
      onSignal: this.shutDownGracefully.bind(this),
      onShutDown: () => {
        console.log("Terminus: Shutdown Successfully")
      },
      timeout: 15000,
    }

    createTerminus(this.server, terminusConfig)
  }

  private async shutDownGracefully(): Promise<void> {
    try {
      console.log("Closing Server Gracefully...")

      for (const connection of this.connections) {
        connection.end()
      }

      console.log("closing Database")
      console.log("Database Closed")
      console.log("Graceful Shutdown successful")
    } catch (e: any) {
      console.log("Graceful Shutdown Failed")
      process.exit(1)
    }
  }
}

// Start the server
new Server()
