import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import { AUTH_ERROR } from "../error";
import { JwtService } from "./jwt.service";
import { userRepository, UserType } from "../db/models";

export class AuthService extends JwtService {
  constructor() {
    super();
  }

  protected async verifyAccessToken(req: Request) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) throw new Unauthorized(AUTH_ERROR.MISSING_HEADER);
    const decodedAccessToken = await this.verify<string>(accessToken);
    return decodedAccessToken;
  }

  protected async verifyRefreshToken(req: Request) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) throw new Unauthorized(AUTH_ERROR.MISSING_HEADER);
    const decodedRefreshToken =
      await this.verify<Partial<UserType>>(refreshToken);
    if (!decodedRefreshToken) throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);
    if (!decodedRefreshToken.id)
      throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);

    const userDetails = await userRepository.findOne({
      where: {
        id: decodedRefreshToken.id,
      },
      relations: ["organizations", "currentOrg"],
      select: [
        "id",
        "is_deleted",
        "is_blocked",
        "currentOrg",
        "name",
        "email",
        "account_type",
      ],
    });

    if (!userDetails) throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);
    if (userDetails.is_deleted) throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);
    if (userDetails.is_blocked) throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);
    if (!userDetails.currentOrg.is_blocked)
      throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);
    if (!userDetails.currentOrg.is_deleted)
      throw new Unauthorized(AUTH_ERROR.INVALID_AUTH);

    return {
      id: userDetails.id,
      name: userDetails.name,
      email: userDetails.email,
      account_type: userDetails.account_type,
      currentOrg: userDetails.currentOrg.id,
    };
  }
  public async generateAccessTokenFromRefreshToken(req: Request) {
    const userDetails = await this.verifyRefreshToken(req);
    const accessToken = await this.sign(userDetails);
    return accessToken;
  }
  protected async getRefreshToken(payload: Partial<UserType>) {
    const decodedRefreshToken = await this.sign(payload, {
      expiresIn: "7d",
    });
    return decodedRefreshToken;
  }
}
