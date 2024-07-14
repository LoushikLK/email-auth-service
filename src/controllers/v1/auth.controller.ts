import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/auth.service";
import { AuthFunctions } from "../../functions/v1/auth.function";
import { Unauthorized } from "http-errors";
import { AUTH_ERROR } from "../../error";
import { ENVIRONMENT } from "../../config";

export class AuthController extends AuthFunctions {
  constructor() {
    super();
  }

  public async register(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      await this.registerUserByEmail(req.body);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  public async verifyEmail(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      const { email, otp } = req.body;
      await this.verifyOtp(email, otp);
      await this.updateUser(email, { is_email_verified: true });
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.loginAndGenerateTokens(req.body);
      if (!result) throw new Unauthorized(AUTH_ERROR.INVALID_CREDENTIALS);

      //set the refresh token in cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: ENVIRONMENT.nodeEnv === "production",
      });

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async getAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken =
        await new AuthService().generateAccessTokenFromRefreshToken(req);
      res.json({
        success: true,
        data: {
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async resendVerificationCode(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      await this.sendVerificationCode(req.body?.email);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  public async changePassword(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      const { email, password } = req.body;

      //verify user
      await this.validateUserLoginByEmail({ email, password });
      await this.changeUserPassword(req.body);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  public async forgotPassword(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      await this.sendVerificationCode(req.body?.email);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  public async forgotPasswordVerify(
    req: Request,
    res: Response<{
      success: boolean;
    }>,
    next: NextFunction,
  ) {
    try {
      const { email, otp, password } = req.body;

      await this.verifyOtp(email, otp);
      await this.changeUserPassword({
        email,
        password,
      });

      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
