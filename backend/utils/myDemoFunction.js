import { typestatus, log } from '../logging/fileLogger.js';

function helloWorld(req, res) {
    res.status(200).send('this is express - up and running');
    log($`{req.method} ${req.url}`, new Date, 200);
}

function whoiam(req, res) {
    res.status(200).send(req.user.username);
    log($`{req.method} ${req.url}`, new Date, 200);
}

function csvtest(req, res) {
    let r = [req.body[1], req.body[2], req.body[3]];
    res.status(200).send(r);
}



export { helloWorld, whoiam, csvtest };