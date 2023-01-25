const config = require('config');
const Africastalking = require('africastalking');

// (config.get('AT').default);

class Airtime {
    constructor({ username, apiKey }) {
        if (!apiKey) {
            throw new Error('"apiKey" is required');
        }
        if (!username) {
            throw new Error('"username" is required');
        }

        this.airtime = Africastalking({ apiKey, username }).AIRTIME;
    }

    send({ recipients, amount }) {
        return new Promise((resolve, reject) => {
            let actualAmount;
            if (Array.isArray(recipients)) {
                actualAmount = amount / recipients.length;
            } else {
                actualAmount = amount;
            }

            const listOfRecipients = recipients.map((recipient, index) => {
                return {
                    phoneNumber: `+${recipient}`,
                    amount: actualAmount,
                    currencyCode: 'KES',
                };
            });

            const options = {
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
}
module.exports = Airtime;
