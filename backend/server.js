/* ************************************************************************* */
/*                                Chat App                                   */
/*                                                                           */
/*  Complete Web App                                                         */
/*                                                                           */
/*  Achim Karasek                                                            */
/*  HTL Villach - Abteilung Informatik                                       */
/*  (c) 2020/21                                                              */
/* ********************'**************************************************** */

'use strict';
import express from 'express';
import dotenv from 'dotenv';
import { convertToBoolean } from './utils/convert.js';
import { log } from './logging/app-logger.js';
import { connectDB } from './dal/db-connector.js';
import { configure, configureInErrorMode } from './app/app-loader.js';

const app = express();
dotenv.config();

const hostname = process.env.HOST;
const port = process.env.PORT;
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
const dbConnectTimeout = process.env.DB_CONNECT_TIMEOUT;
const runWithoutAuth = process.env.RUN_WITHOUT_AUTH;

const main = async () => {
  let recreateDatabase = convertToBoolean(process.env.RECREATE_DATABASE);

  try {
    log.info(`server started. trying to connect to database ...`);

    await connectDB(mongoConnectionString, dbConnectTimeout, recreateDatabase);
    if (recreateDatabase) {
      log.warning('Current Database dropped');
    }
    log.success(`DBConnect to ${mongoConnectionString} successful`);

    configure(app, runWithoutAuth);
    log.info(`Chat Web Application successfully configured`);
  } catch (err) {
    configureInErrorMode(app);
    log.error(
      `Chat Web Application running in error-mode.\n` +
        `There were startup-problems. App is not healthy!\n` +
        err,
    );
  }

  app.listen(port, hostname, () => {
    log.success(`Web Server up and running at: ${hostname}:${port}.`);
  });
};

main();

export default app;
