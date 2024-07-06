import { Router } from "express";
import { AuthController } from "../../controllers/v1";

class AuthRoutes extends AuthController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/", AuthController.create);
  }
}

export = { routes: new AuthRoutes().router };
