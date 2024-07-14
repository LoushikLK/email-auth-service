require("dotenv").config();

const ENVIRONMENT = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "s3cr3t",
  dbUri:
    process.env.DB_URI || "postgresql://postgres:1234@localhost:5432/postgres",
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  nodeEnv: process.env.NODE_ENV,
};

export { ENVIRONMENT };
