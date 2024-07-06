import { NextFunction, Request, Response } from "express";
import { auth } from "../../functions/v1";

export class AuthController {
  constructor() {}

  protected static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.send(auth.createUser());
  }
}
