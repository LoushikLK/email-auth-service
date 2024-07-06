import { Application, NextFunction, Request, Response } from "express";
import { readdirSync } from "fs";
import path from "path";
import { logger } from "../utils";

const routerParser = (app: Application) => {
  // load all routes
  readdirSync(path.join(__dirname, "..", "routes"), {
    withFileTypes: true,
  }).map((folder) => {
    if (folder.isDirectory()) {
      readdirSync(path.join(__dirname, "..", "routes", folder.name), {
        withFileTypes: true,
      }).map((route) => {
        if (route.isFile()) {
          const routePath = path.join(
            __dirname,
            "..",
            "routes",
            folder.name,
            route.name
          );

          // load route
          const routeModule = require(routePath);
          const apiPathName = `/${folder.name}/${route.name?.split(".")?.[0]}`;
          app.use(apiPathName, routeModule.routes);
          logger.info(`API Route Registered: ${apiPathName}`);
        }
      });
    }
  });
};

export { routerParser };
