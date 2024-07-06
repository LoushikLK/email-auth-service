import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { httpLogger } from "../utils";

const topMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
    })
  );

  app.use(express.json());

  app.use(helmet());

  app.use(httpLogger);
};

export { topMiddleware };
