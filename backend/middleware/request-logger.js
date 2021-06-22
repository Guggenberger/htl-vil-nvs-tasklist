import { log } from '../logging/app-logger.js';

function requestLogger(req, res, next) {
  // stop polluting the req-object
  //req.incomingTimeStamp = new Date();
  //req.logEntry = `${req.method} ${req.url}`;
  log.verbose(`${req.method} ${req.url}`);
  next();
}

export { requestLogger };
