function requestLogger (req, res, next) {
  req.incomingTimeStamp = new Date();
    if(req.accessDenied) {
      console.log(`%c${req.incomingTimeStamp} ${req.method} ${req.url} 401 - Access denied`, `color:red`);
      res.status(401).send("Access denied");
      return;
    }
    console.log(`%c${req.incomingTimeStamp} ${req.method} ${req.url}`, `color:green`);
    next();
}

export { requestLogger };