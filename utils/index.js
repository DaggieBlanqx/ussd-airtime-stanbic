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
                console.trace({ stanbic_outcome });

                setTimeout(() => {
                    Airtime.send({
                        recipients,
                        amount,
                    })
                        .then((airtime_outcome) => {
                            console.trace({ airtime_outcome });
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
                }, 5000);
            })
            .catch((StanbicErr) => {
                console.trace({ StanbicErr });

                reject({ StanbicErr });
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

            resolve({status: "success", allTasks});
        } catch (error) {
            reject({status:"error", error});
        }
    });
};

const RainMaker = RainMakerSequential;
// const RainMaker = RainMakerParallel;

module.exports = RainMaker;
