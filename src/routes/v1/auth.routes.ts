import { Router } from "express";
import { AuthController } from "../../controllers/v1";
import { validateRegistration } from "../../validations";

class AuthRoutes {
  public router: Router;
  private controller: AuthController;
  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/register",
      validateRegistration(),
      this.controller.register,
    );
    this.router.post("/login", this.controller.login);
    this.router.get("/access-token", this.controller.getAccessToken);
  }
}

export = { routes: new AuthRoutes().router };
