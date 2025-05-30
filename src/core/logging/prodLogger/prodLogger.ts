import pino from "pino"

const prodLogger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
})

export default prodLogger
