const StanbicAPI = require('./Stanbic');
const config = require('config');
const AirtimeAPI = require('./Airtime');

const Stanbic = new StanbicAPI(config.get('Stanbic'));
const Airtime = new AirtimeAPI(config.get('AT').default);

const RainMaker = ({ amount, recipients, sender }) => {
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

module.exports = RainMaker;
