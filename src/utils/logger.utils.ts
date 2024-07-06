import morgan from "morgan";
import path from "path";
import { createLogger, format, transports } from "winston";

const logFolder = (loggerName: string) => {
  return path.join(__dirname, "..", "..", "logs", loggerName);
};

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "auth" },
  transports: [
    new transports.File({ filename: logFolder("error.log"), level: "error" }),
    new transports.File({ filename: logFolder("combined.log") }),
  ],
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

//morgan logger for http requests

const httpLogger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

export { httpLogger, logger };
