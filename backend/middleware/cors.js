const baseUrl = process.env.REACT_APP_FRONTEND_URL;

export function cors() {
    return(req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', "http://projektautark-client.htl-vil");
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', "*");

        res.setHeader(
            'Access-Control-Allow-Headers',
            'content-type, Authorization',
        )

        res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE');

        if (req.method.toUpperCase() === 'OPTIONS') {
            res.status(200).send('PREFLIGHT OK');
        } else {
            next();
        }
    };
}