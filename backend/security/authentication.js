import { log }                    from '../logging/app-logger.js';
import { convertToBoolean }       from '../utils/convert.js';

let loggedInUsers = {};

const loginUser = (authorizationId, user) => {
  loggedInUsers[authorizationId] = user;
}

const logoutUser = (authorizationId) => {
  delete loggedInUsers[authorizationId];
}

const getUser = (authorizationId) => {
  return loggedInUsers[authorizationId];
}

function authenticate(req, res, next) {
  let auth_off = convertToBoolean(process.env.RUN_WITHOUT_AUTH);
  if (!auth_off) {

    let authorizationString = req.headers['authorization'];
    if (!authorizationString) {
      AnswerAccessDenied(req, res, 'Provide a authorization header!');
      return;
    }
    let user = getUser(authorizationString);

    if (typeof user === 'undefined') {
      res.status(401).send('Object undefined');
      return
    }
    
    if (user === null) {
      AnswerAccessDenied(req, res, 'Provide a VALID authorization header!');
      return;
    }

    if (user.username === "undefined") {
      res.status(401).send('Access denied. Username is undefined');
      return;
    }

    if (user.password === "undefined") {
      res.status(401).send('Access denied. Username is undefined');
      return;
    }

    if (!user.username || !user.password) {
      res.status(401).send('Access denied. Provide a valid credentials-object');
      return;
    }

    delete user.password;
    req.user = user;
  } else {
    console.info("No Auth");
  }

  next();
}

function AnswerAccessDenied(req, res, detailMessage) {
  res
    .status(401)
    .send(`Access denied you are not authorized! ${detailMessage}`);
  log.warning(`401 - Access denied on "${req.method} ${req.url}"`);
}

export { authenticate, loginUser, logoutUser, getUser };
