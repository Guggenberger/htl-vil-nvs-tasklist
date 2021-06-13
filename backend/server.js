/* ************************************************************************* */
/*                                Task  list                                 */
/*                                                                           */
/*  Complete Web App                                                         */
/*                                                                           */
/*  Mathias Guggenberger                                                     */
/*  HTL Villach - Abteilung Informatik                                       */
/*  (c) 2020/21                                                              */
/* ********************'**************************************************** */

const hostname = 'localhost';
const port = 2604;
const express = require("express");
const app = express();

app.use(express.json());

app.get('/helloExpress', (req, res) => {
    res.status(200).send('this is express - up and running');
});

app.listen(port, hostname, () => {
    console.info(`Chat Web Application is up and running on ${hostname}:${port}.`);
})