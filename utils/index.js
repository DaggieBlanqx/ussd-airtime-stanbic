const StanbicAPI = require('./Stanbic');
const config = require('config');
const AirtimeAPI = require('./Airtime');

const Stanbic = new StanbicAPI(config.get('Stanbic'));
const Airtime = new AirtimeAPI(config.get('AT').default);

const RainMakerSequential = ({ amount, recipients, sender }) => {
    /// Trigger STK push, wait for 5seconds then send airtime.
    return new Promise((resolve, reject) => {
        Stanbic.stkPush({ amount, phone: sender })
            .then((stanbic_outcome) => {
                console.info({ stanbic_outcome });

                Airtime.send({
                    recipients,
                    amount,
                })
                    .then((airtime_outcome) => {
                        console.info({ airtime_outcome });
                        resolve({
                            status: 'success',
                            data: {
                                mpesa: stanbic_outcome.data,
                                airtime: airtime_outcome.data,
                            },
                        });
                    })
                    .catch((airtimeErr) => {
                        console.trace(airtimeErr);
                        reject({ airtimeErr });
                    });
            })
            .catch((StanbicErr) => {
                console.trace({ StanbicErr });

                reject({ StanbicErr });
            });
    });
};
const RainMakerAirtimeOnly = ({ amount, recipients }) => {
    return new Promise((resolve, reject) => {
        Airtime.send({
            recipients,
            amount,
        })
            .then((airtime_outcome) => {
                console.info({ airtime_outcome });
                resolve({
                    status: 'success',
                    data: {
                        airtime: airtime_outcome.data,
                    },
                });
            })
            .catch((airtimeErr) => {
                console.trace(airtimeErr);
                reject({ airtimeErr });
            });
    });
};

const RainMakerParallel = ({ amount, recipients, sender }) => {
    return new Promise((resolve, reject) => {
        try {
            const allTasks =
                Promise.all[
                    (Stanbic.stkPush({ amount, phone: sender }),
                    Airtime.send({
                        recipients,
                        amount,
                    }))
                ];

            resolve({ status: 'success', allTasks });
        } catch (error) {
            reject({ status: 'error', error });
        }
    });
};

// const RainMaker = RainMakerSequential;
// const RainMaker = RainMakerParallel;
const RainMaker = RainMakerAirtimeOnly;

module.exports = RainMaker;
