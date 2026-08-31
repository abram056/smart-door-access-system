import express from "express";
import cors from "cors";
import apiRoutes from "./routes";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // docs/09_Setup.md smoke test: curl http://localhost:3000/
  app.get("/", (_req, res) => {
    res.json({ message: "Smart Door Access API" });
  });

  app.use("/api", apiRoutes);

  // Must come after all real routes, before the error handler.
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
