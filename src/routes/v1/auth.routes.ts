import { Router } from "express";
import { AuthController } from "../../controllers/v1";
import {
  validateChangePassword,
  validateEmailLogin,
  validateEmailVerify,
  validateForgotPassword,
  validateForgotPasswordOTPVerify,
  validateRegistration,
  validateResendVerificationCode,
} from "../../validations";
import { AuthService } from "../../services/auth.service";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

class AuthRoutes {
  public router: Router;
  private controller: AuthController;
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/register",
      validateRegistration(),
      this.controller.register,
    );
    this.router.post(
      "/verify-email",
      validateEmailVerify(),
      this.controller.verifyEmail,
    );
    this.router.post(
      "/resend-verification-code",
      validateResendVerificationCode(),
      this.controller.resendVerificationCode,
    );
    this.router.post("/login", validateEmailLogin(), this.controller.login);
    this.router.get("/access-token", this.controller.getAccessToken);
    this.router.post(
      "/change-password",
      validateChangePassword(),
      this.authMiddleware.authenticate,
      this.controller.changePassword,
    );
    this.router.post(
      "/forgot-password",
      validateForgotPassword(),
      this.controller.forgotPassword,
    );
    this.router.post(
      "/forgot-password-verify",
      validateForgotPasswordOTPVerify(),
      this.controller.forgotPasswordVerify,
    );
  }
}

export = { routes: new AuthRoutes().router };
