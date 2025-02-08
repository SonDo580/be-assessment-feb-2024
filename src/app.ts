import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { GENERAL_CONFIG } from "./config";
import { router } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { NotFoundError } from "./core/error.response";

const app = express();

// Middlewares
app.use(cors());
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

const { PORT } = GENERAL_CONFIG;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
