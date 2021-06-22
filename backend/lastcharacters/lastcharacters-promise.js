import fs       from 'fs';
import { log }  from '../logging/fileLogger.js';

function checkQueryString(req, res) {
    return new Promise((reject, resolve) => {
        var msg = req.method + " " + req.url;
    
        //Wrong query string 400
        if(!req.query.numberOfChars || !req.query.path) {
            res.status(400).send("Bad request - Query string not given or wrong!");
            log(400, msg);
            resolve();
        }
    
        //Wrong query string 400
        if(req.query.numberOfChars == 0) {
            res.status(400).send("Access denied - numberOfChars must be bigger than 0");
            log(400, msg);
            resolve();
        }

        //Wrong query string 400
        if(isNaN(req.query.numberOfChars)) {
            res.status(400).send("Access denied - numberOfChars must be a number");
            log(400, msg);
            resolve();
        }
    
        //Wrong query string 400
        if(Object.keys(req.query).length > 2) {
            res.status(400).send("Bad request - Too many keys");
            log(400, msg);
            resolve();
        }
    
        req.query.path = req.query.path.replace(/"/, "");
        res.startReading = new Date();
    
        reject();
    });
}

function readData(req, res) {
    return new Promise((reject, resolve) => {
        var msg = req.method + " " + req.url;
        try {
            let data = (fs.readFileSync(req.query.path)).toString();
            //Empty file 400
            if(data.length == 0) {
                res.status(400).send("Bad request - File is empty");
                log(400, msg);
                resolve();
            } else {
                reject(data);
            }
        } catch (error) {
            res.status(404).send('Error - File not found');
            log(404, msg);
            resolve();
        }
    });
}

function getResponseData(req, res, data) {
    return new Promise(() => { 
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
    });
}

function readLastCharPromise(req, res) {
    checkQueryString(req, res).then(() => {
        readData(req, res).then((result) => {
            getResponseData(req, res, result);
        }).catch(()=> {

        });
    }) .catch(()=> {

    });
}

export { readLastCharPromise, checkQueryString, readData, getResponseData }