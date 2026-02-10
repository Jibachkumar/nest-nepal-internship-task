import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fs from "fs"
import swaggerUi from "swagger-ui-express";

const swaggerFile = JSON.parse(
  fs.readFileSync(new URL("../swagger-output.json", import.meta.url))
);

dotenv.config({
  path: "./.env",
});

const app = express();

// config helmet
app.use(
  helmet({
    xPoweredBy: false,
  })
);

// express config
app.use(express.json());
app.use(cookieParser());

// import routes
import { userRouter } from "./routes/user.routes.js";
import { salesRouter } from "./routes/sales.routes.js";

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sales", salesRouter);

// error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export { app };
