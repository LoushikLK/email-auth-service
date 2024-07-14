import express from "express";
import { createServer, Server } from "http";
import { bottomMiddleware, routerParser, topMiddleware } from "./middlewares";
import "reflect-metadata";
import { dbInitialize } from "./db";
import { ENVIRONMENT } from "./config";
import { logger } from "./utils";

export class ExpressServer {
  private server: Server;
  private expressApp: express.Application;

  constructor() {
    this.expressApp = express();
    this.server = createServer(this.expressApp);
    this.middlewares();
  }

  private middlewares() {
    topMiddleware(this.expressApp);
    routerParser(this.expressApp);
    bottomMiddleware(this.expressApp);
  }

  public async start() {
    await dbInitialize();
    this.server.listen(ENVIRONMENT.port, () => {
      logger.info(`Server running on port ${ENVIRONMENT.port}`);
    });
  }
}
