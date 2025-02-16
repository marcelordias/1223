import { Router } from "express";
import { userInfo } from "../controllers/user.controller";

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/user-info", (req, res): void => {
      userInfo(req, res);
    });
  }
}

export default new UserRoutes().router;
