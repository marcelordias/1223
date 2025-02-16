import { Application } from "express";
import { logMiddleware } from "../middlewares/log.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

export default class Routes {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
    this.intializeRoutes();
  }

  private intializeRoutes() {
    try {
      // log middleware
      this.app.use(logMiddleware);

      this.app.use("/api/v1/auth", authRoutes);

      this.app.use(authMiddleware);
      this.app.use("/api/v1/user", userRoutes);

    } catch (error) {
      console.log("Error initializing routes: ", error);
    }
  }
}
