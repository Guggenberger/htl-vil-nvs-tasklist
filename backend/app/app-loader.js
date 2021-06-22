import express from 'express';
const { json } = express;

import { fileLog }              from '../logging/file-logger.js';
import { requestLogger }        from '../middleware/request-logger.js';
import { authenticate }         from '../security/authentication.js';
import { whoiam, helloWorld }   from '../utils/myDemoFunction.js'
import { readLastCharSync }     from '../lastcharacters/lastcharacters-sync.js';
import { readLastCharCBF }      from '../lastcharacters/lastcharacters-cbf.js';
import { readLastCharPromise }  from '../lastcharacters/lastcharacters-promise.js';
import { readLastCharAwait }    from '../lastcharacters/lastcharacters-await.js';
import { userRouter }           from '../users/user-router.js';
import { csv }                  from '../middleware/csv-body-parser.js';
import { loginRouter }          from '../login/login-router.js';
import {convertToBoolean}       from '../utils/convert.js';
import { healthChecker }        from '../utils/health-checker.js';
import { cors }                 from "../middleware/cors.js"; 
import {
  globalErrorHandler,
  defaultErrorMessage,
}                               from '../error/error-handling.js';

export const configure = async (app) => {
  let auth_off = convertToBoolean(process.env.RUN_WITHOUT_AUTH);

  loadHealthCheck(app);

  app.use(json());
  app.use(requestLogger)
  app.use(csv());
 

/*
  if (auth_off) {
    console.log(" without authenticate");
  } else {
    console.log(" with authenticate");
    app.use(authenticate);
  }
  */
  app.use(cors());
  app.use('/api/v1/auth', loginRouter);
  app.use('/api/v1/users', userRouter);


  app.get('/helloExpress', helloWorld);
  app.get('/helloWorld', helloWorld);
  app.get('/whoiam', whoiam);
  app.get('/lastcharacters', readLastCharSync);

  app.get('/lastcharacters-await', readLastCharAwait);
  app.get('/lastcharacters-cbf', readLastCharCBF);
  app.get('/lastcharacters-promise', readLastCharPromise);
  app.get('/lastcharacters-sync', readLastCharSync);

  app.get('/', (req, res) => {
    res.status(200).send("this is the main page - up ang running");
    fileLog(`${req.logEntry}`, new Date(), res.statusCode);
  });
};

export const configureInErrorMode = async (app) => {
  loadHealthCheck(app);
  app.use(defaultError);
};

function loadHealthCheck(app) {
  app.get('/api/v1/healthcheck', healthChecker);
}

