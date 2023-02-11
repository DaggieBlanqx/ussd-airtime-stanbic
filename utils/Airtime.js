const config = require('config');
const crypto = require('crypto');
const Africastalking = require('africastalking');
const { resolve } = require('path');
const { reject } = require('lodash');

class Airtime {
    constructor({ username, apiKey }) {
        if (!apiKey) {
            throw new Error('"apiKey" is required');
        }
        if (!username) {
            throw new Error('"username" is required');
        }

        this.airtime = Africastalking({ apiKey, username }).AIRTIME;
        this.AT_APP = Africastalking({ apiKey, username }).APPLICATION;
    }

    send({ recipients, amount }) {
        return new Promise((resolve, reject) => {
            let actualAmount;
            if (Array.isArray(recipients)) {
                actualAmount = amount / recipients.length;
            } else {
                actualAmount = amount;
            }

            if (actualAmount > 10) {
                actualAmount = 10;
            } else if (actualAmount < 5) {
                actualAmount = 5;
            }

            const listOfRecipients = recipients.map((recipient, index) => {
                return {
                    phoneNumber: `+${recipient}`,
                    amount: actualAmount,
                    currencyCode: 'KES',
                };
            });

            const options = {
                idempotencyKey: crypto.randomUUID(),
                recipients: listOfRecipients,
            };

            this.airtime
                .send(options)
                .then((results) => {
                    if (results.errorMessage === 'None') {
                        resolve({ status: 'success', data: results.responses });
                    } else {
                        if (results.responses.length) {
                            reject({ error: results.responses });
                        } else {
                            reject({
                                error: { errorMessage: results.errorMessage },
                            });
                        }
                    }
                })
                .catch((error) => reject({ error }));
        });
    }

    getBalance() {
        return new Promise((resolve, reject) => {
            // Fetch the application data
            this.AT_APP.fetchApplicationData()
                .then((data) => {
                    let balance = data.UserData.balance;
                    resolve({
                        status: 'success',
                        data: {
                            balance,
                            currency: balance.split(' ')[0],
                            numeric: balance.split(' ')[1],
                        },
                    });
                })
                .catch((error) => reject({ error }));
        });
    }
}
module.exports = Airtime;
