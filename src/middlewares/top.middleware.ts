import cors from "cors";

import express, { Application } from "express";
import helmet from "helmet";
import { httpLogger } from "../utils";
import cookieParser from "cookie-parser";

const topMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    }),
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
    }),
  );

  app.use(cookieParser()); // parse cookies
  app.use(express.json()); // parse json
  app.use(helmet()); // security headers
  app.use(httpLogger); // http logger
};

export { topMiddleware };
