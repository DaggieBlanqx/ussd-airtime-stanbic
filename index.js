const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');

let indexRoutes = require('./routes/index.js');

const main = async () => {
    const app = express();

    app.use(bodyParser.json()); // support json encoded bodies
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.set('trust proxy', 1); // trust first proxy

    app.use('/', indexRoutes).listen(config.get('PORT'), () =>
        console.info(`Listening on ${config.get('PORT')}`)
    );
};

main();
