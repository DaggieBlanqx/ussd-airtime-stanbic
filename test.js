const StanbicAPI = require('./utils/Stanbic');
const config = require('config');

const Stanbic = new StanbicAPI(config.get('Stanbic'));

// Stanbic.generateToken()
//     .then((xyz) => console.trace({ xyz }))
//     .catch((err) => console.error({ err }));

//

Stanbic.stkPush({ amount: 10, phone: 254705212848 })
    .then((xyz) => console.trace({ xyz }))
    .catch((err) => console.error({ err }));
