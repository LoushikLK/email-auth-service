import { Application } from "express";
import { errorHandler } from "../utils";

const bottomMiddleware = (app: Application) => {
  //handle not created route
  app.use(async (req, res, next) => {
    res.status(404);
    res.json({
      msg: "Not Found",
      success: false,
    });
  });

  app.use(errorHandler); //handle error
};

export { bottomMiddleware };
