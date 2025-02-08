import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { router } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { NotFoundError } from "./core/http-errors";

const app = express();

// Middlewares
app.use(cors()); // should specify allowed origins in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
const globalPrefix = "/api";
app.use(globalPrefix, router);

// Handle 404 error
app.use((req, res, next) => {
  throw new NotFoundError();
});

// Catch-all error handler
app.use(errorHandler);

export { app };
