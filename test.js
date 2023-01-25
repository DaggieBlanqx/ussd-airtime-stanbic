const StanbicAPI = require('./utils/Stanbic');
const config = require('config');

const Stanbic = new StanbicAPI(config.get('Stanbic'));

Stanbic.generateToken()
    .then((xyz) => console.trace({ xyz }))
    .catch((err) => console.error({ err }));
