import mongoose from 'mongoose';
import AppError from './AppError.js';
import { log } from '../logging/app-logger.js';

export const defaultErrorMessage = (req, res) => {
  res
    .status(500)
    .send('Problems at start up - contact the admin or use the healthcheck ');
};

export const globalErrorHandler = (err, req, res, next) => {
  let errorHandled = handleAppSpecificError(err, req, res, next);
  if (!errorHandled) {
    // log.debug(err.stack);
    log.error(err);
    res.status(500).send('Something broke!');
  }
};

export const errorTester = (req, res) => {
  req.thereIsNoSuchMethod();
  res.status(200, 'OK');
};

export const handleAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

function handleAppSpecificError(err, req, res, next) {
  let errorHandled = false;

  if (err instanceof AppError) {
    res.status(err.statusCode).send(getErrorMessage(err));
    errorHandled = true;
  }

  if (!errorHandled && err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
    errorHandled = true;
  }

  if (!errorHandled && err.name == 'MongoError' && err.code == 11000) {
    let errMsg = 'This is a duplicate Key Error';
    let key = Object.keys(err.keyValue)[0];
    let value = key ? err.keyValue[key] : '';

    errMsg = `Object with "${key}" "${value}" already exists.`;
    res.status(400).send(errMsg);
    errorHandled = true;
  }

  return errorHandled;
}

function getErrorMessage(err) {
  if (err.msg) return err.msg;
  if (err.message) return err.message;

  switch (err.statusCode.toString()) {
    case '400':
      return 'Bad Request';
    case '401':
      return 'Unauthorized';
    case '404':
      return 'Not found';
    default:
      return 'Internal server error - something broke';
  }
}
