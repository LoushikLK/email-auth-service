import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../config";
import { JWT_ERROR } from "../error";
import { Unauthorized, BadRequest } from "http-errors";
export class JwtService {
  protected sign(payload: string | object | Buffer, options?: jwt.SignOptions) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        ENVIRONMENT.jwtSecret,
        { expiresIn: "8h", ...options },
        (err, token) => {
          if (err) {
            reject(new BadRequest(JWT_ERROR.TOKEN_GENERATION_FAILED));
          }
          resolve(token);
        },
      );
    });
  }

  protected verify<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, ENVIRONMENT.jwtSecret, (err, decoded) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject(new Unauthorized(JWT_ERROR.EXPIRED_JWT));
          }
          reject(new Unauthorized(JWT_ERROR.INVALID_JWT));
        }
        resolve(decoded as T);
      });
    });
  }
}
