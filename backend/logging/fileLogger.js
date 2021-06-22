import fs from 'fs';
import { formatDate } from '../utils/utils.js';

let logger = fs.createWriteStream('debug.log.md');

const typestatus = {
    debug: ':white_check_mark:',
    warning: ':warning:',
    error: ':no_entry:',
    bad: ':-1:'
}

function writeLogTableHeader() {
    logger.write(" | Symbol | Date | Entry | \n | ------ | ------ | ------ | \n");
}
  
function log(msg, date, type) {
    let emoji;
    let fdate = formatDate(date);
  
    if(type == 200) {
      emoji = typestatus.debug;
      msg = msg + " 200 - OK";
    }
    else if(type == 401) {
      emoji = typestatus.warning;
      msg = msg + " 401 - Acess denied";
    }
    else if(type == 400) {
      emoji = typestatus.bad;
      msg = msg + " 400 - Bad request";
    }
    else {
      emoji = typestatus.error;
      msg = msg + " 404 - Error";
    }
  
    logger.write(" | " + emoji + " | " + fdate + " | " + msg + " | \n");
}

writeLogTableHeader();
export { typestatus, log };
  