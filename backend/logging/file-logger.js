// on the long run > avoid file logging, change format
// or make the logging format more flexible
import fs from 'fs';
import { formatDate } from '../utils/utils.js';

let stream = fs.createWriteStream('./log-data/debug.log.md');

const logType = {
  debug: 1,
  warning: 2,
  error: 3,
};

function writeLogTableHeader() {
  stream.write(`| Symbol | Date | Entry |\n`);
  stream.write(`| --- | --- | --- |\n `);
}

function fileLog(msg, date, type) {
  let symbol = `:heavy_check_mark:`;
  switch (type) {
    case logType.warning:
      symbol = `:warning:`;
      break;
    case logType.error:
      symbol = `:x:`;
      break;
  }
  stream.write(`| ${symbol} | ${formatDate(date)} |${msg} |\n`);
}

writeLogTableHeader();
export { logType, fileLog };
