import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

export default corsOptions;