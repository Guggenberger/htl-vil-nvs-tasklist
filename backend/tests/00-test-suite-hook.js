import chai from 'chai';
import chaiHttp from 'chai-http';
import { log } from '../logging/app-logger.js';

chai.use(chaiHttp);

export const healthCheck = (app) => {
  return new Promise((resolve, reject) => {
    log.debug('healthCheck executing now ...');
    let intervalBetweenAttpempts = 1000;
    let maxNumberOfAttempts = 15;
    // todo: avoid the hardcoded-url here
    let healthCheckpoint = '/api/v1/healthcheck';

    let numberOfAttempts = 0;

    let healthPointChecker = setInterval(() => {
      numberOfAttempts++;
      log.debug(
        `doing healthcheck Nr: ${numberOfAttempts} now on ${healthCheckpoint}`,
        new Date().toTimeString(),
      );
      chai
        .request(app)
        .get(healthCheckpoint)
        .end((err, res) => {
          if (!err && res.status === 200) {
            clearInterval(healthPointChecker);
            resolve();
          }
          if (numberOfAttempts >= maxNumberOfAttempts) {
            clearInterval(healthPointChecker);
            reject('can not start test suite. app is not healty');
          }
        });
    }, intervalBetweenAttpempts);
  });
};
