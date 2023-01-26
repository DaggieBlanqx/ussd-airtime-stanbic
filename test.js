const StanbicAPI = require('./utils/Stanbic');
const config = require('config');
const AirtimeAPI = require('./utils/Airtime');
const RainMaker = require('./utils/index');
 
const Stanbic = new StanbicAPI(config.get('Stanbic'));
const Airtime = new AirtimeAPI(config.get('AT').default);

// Stanbic.stkPush({ amount: 10, phone: 254705212848 })
//     .then((xyz) => console.log({ xyz }))
//     .catch((err) => console.trace({ err }));

// Airtime.send({ recipients: ['254705212848', '254773841221'], amount: 10 })
//     .then((xyz) => console.log({ xyz }))
//     .catch((err) => console.trace(err));

// Airtime.getBalance()
//     .then((xyz) => console.log({ xyz }))
//     .catch((err) => console.error(err));

const inputData = {
    amount: 10, // Amount is what the user will be prompted to pay via Mpesa
    recipients: [254705212848, 254716800998], // recipients are the people who will recieve the airtime,
    sender: 254705212848, // sender is the phone number that will recieve an MPesa STK prompt
};

// RainMaker(inputData)
//     .then((rm) => console.log({ rm }))
//     .then((rm_oops) => console.trace({ rm_oops }));
 