import fs       from 'fs';
import { log }  from '../logging/fileLogger.js';

function checkQuery(req, res, callback) {
    var msg = req.method + " " + req.url;

    //Wrong query string 400
    if(!req.query.numberOfChars || !req.query.path) {
        res.status(400).send("Bad request - Query string not given or wrong!");
        log(400, msg);
        return;
    }

    //Wrong query string 400
    if(req.query.numberOfChars == 0) {
        res.status(400).send("Access denied - numberOfChars must be bigger than 0");
        log(400, msg);
        return;
    }

    //Wrong query string 400
    if(isNaN(req.query.numberOfChars)) {
        res.status(400).send("Access denied - numberOfChars must be a number");
        log(400, msg);
        return;
    }

    //Wrong query string 400
    if(Object.keys(req.query).length > 2) {
        res.status(400).send("Bad request - Too many keys");
        log(400, msg);
        return;
    }

    req.query.path = req.query.path.replace(/"/, "");
    res.startReading = new Date();

    callback(req, res);
}

function readData(req, res, callback) {
    let data;
    var msg = req.method + " " + req.url;

    //Wrong Path -> no File 404
    try {
        data = (fs.readFileSync(req.query.path)).toString();
    } catch (error) {
        res.status(404).send('Error - File not found');
        log(404, msg);
        return;
    }

    //Empty file 400
    if(data == 0) {
        res.status(400).send("Bad request - File is empty");
        log(400, msg);
        return;
    }

    callback(req, res, data);
}

function responseData(req, res, data) {
    if(req.query.numberOfChars > data.length) {
        req.query.numberOfChars = data.length;
    }

    res.startExtracting = new Date();
    res.lastchars = data.substring(data.length - req.query.numberOfChars);
    res.endProcessing = new Date();
    res.durationReading = res.startExtracting - res.startReading;
    res.durationExtracting = res.endProcessing - res.startExtracting;
    res.durationComplete = res.durationReading + res.durationExtracting;

    let responseData = `{
        "lastchars":            "${res.lastchars}", 
        "startReading":         "${res.startReading}",
        "durationReading":      ${res.durationReading},
        "startExtracting":      "${res.startExtracting}",
        "durationExtracting":   ${res.durationExtracting},
        "endProcessing":        "${res.endProcessing}",
        "durationComplete":     ${res.durationComplete}
    }`;

    res.status(200).send(responseData);
}

function readLastCharCBF(req, res) {
    checkQuery(req, res, () => {readData(req, res, responseData)});
}

export { readLastCharCBF }