import { DataSource } from "typeorm";
import { CurrentOrg, Organization, User } from "./models";
import { logger } from "../utils";
import { ENVIRONMENT } from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENVIRONMENT.dbUri,
  entities: [User, CurrentOrg, Organization],
  synchronize: true,
  logging: false,
  extra: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
});

const dbInitialize = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await AppDataSource.initialize();
      logger.info("Database has been initialized!");
      resolve(true);
    } catch (error) {
      logger.error("Error during Database initialization:", error);
      reject(error);
    }
  });
};

export { dbInitialize };
