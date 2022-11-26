/**
 * Module dependencies.
 */

import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import dbStart from "./dbStart";
import { logger } from "./config/winston";

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 * @public
 */

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

  await dbStart();

  app.listen(PORT, () => {
    logger.info(`Listening on Port ${PORT}`);
  });
};

startServer();
