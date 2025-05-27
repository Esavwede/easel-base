import config from "config"
import cors from "cors"

const corsConfig = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (
      !origin ||
      config.get<string[]>("cors.allowedOrigins").includes(origin)
    ) {
      callback(null, true)
    } else {
      console.log("Origin not allowed by CORS:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: config.get<string[]>("cors.methods"),
  allowedHeaders: config.get<string[]>("cors.allowedHeaders"),
  credentials: config.get<boolean>("cors.credentials"),
  maxAge: config.get<number>("cors.maxAge"),
}

export default cors(corsConfig)
