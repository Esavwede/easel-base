import pino from "pino"

const devLogger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname,req,res,responseTime",
    },
  },
  serializers: {},
})

export default devLogger
