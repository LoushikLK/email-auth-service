import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/auth.service";
import { AuthFunctions } from "../../functions/v1/auth.function";

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

  protected async create(req: Request, res: Response, next: NextFunction) {
    res.send("hello");
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    res.send("hello");
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
}
