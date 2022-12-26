/**
 * Module dependencies.
 */

import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import dbStart from "./dbStart";
import { logger } from "./config/winston";
import crisInfoServeice from "./src/services/crisinfoService";

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

  //서버를 최초로 작동하면 crisinfo 업데이트를 하게된다.
  crisInfoServeice.update();
  //매일 3시20분에 데이터베이스를 업데이터 한다.
  crisInfoServeice.taskScheduler();
};

startServer();
