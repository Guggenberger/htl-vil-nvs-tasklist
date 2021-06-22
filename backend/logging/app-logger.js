// not so nice, but simple - process env file must be loaded before we can use them
import dotenv from 'dotenv';
dotenv.config();

import { fileLog } from './file-logger.js';

const logLevel = {
  verbose: -1,
  debug: 0,
  info: 1,
  warning: 2,
  success: 3,
  error: 4,
};

const Color = {
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
};

// todo: integrate file-logger here in a better way
const globalLogLevel = logLevel[process.env.APP_LOGLEVEL] || logLevel.debug;
const doFileLogging = process.env.FILE_LOGGING_ENABLED;

const log = {
  verbose: (msg) => {
    if (globalLogLevel <= logLevel.verbose) writeLog(msg, Color.FgMagenta);
  },
  debug: (msg) => {
    if (globalLogLevel <= logLevel.debug) writeLog(msg, Color.FgBlue);
  },
  info: (msg) => {
    if (globalLogLevel <= logLevel.info) writeLog(msg, Color.FgBlue);
  },
  warning: (msg) => {
    if (globalLogLevel <= logLevel.warning) writeLog(msg, Color.FgYellow);
  },
  success: (msg) => {
    if (globalLogLevel <= logLevel.warning) writeLog(msg, Color.FgGreen);
  },
  error: (msg) => {
    if (globalLogLevel <= logLevel.error) writeLog(msg, Color.FgRed);
  },
};

function writeLog(msg, colorCode) {
  console.log(colorCode ? colorCode : '', msg);
}

export {log};
