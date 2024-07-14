import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthMiddleware extends AuthService {
  public async authenticate(req: Request, res: Response, next: NextFunction) {
    //try to validate access token
    const decodedAccessToken = await this.verifyAccessToken(req);
    next(decodedAccessToken);
  }
}
