import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

class HomeRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", (req, res): void => {
      register(req, res);
    });
    this.router.post("/login", (req, res): void => {
      login(req, res);
    });
  }
}

export default new HomeRoutes().router;
