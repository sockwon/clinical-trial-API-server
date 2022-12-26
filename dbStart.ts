import database from "./src/models/database";
import { logger } from "./config/winston";

const dbStart = async () => {
  await database
    .initialize()
    .then(async () => {
      // await database.query(
      //   `CREATE database IF NOT EXISTS 'clinical_trial_test'`
      // );
      logger.info("Data Source has been initialized!");
    })
    .catch((err: any) => {
      logger.error("Error during Data Source initialization", err);
      database.destroy();
    });
};

export default dbStart;
