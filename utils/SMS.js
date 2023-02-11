const config = require('config');
const Africastalking = require('africastalking');

class SMS {
    constructor({ username, apiKey }) {
        if (!apiKey) {
            throw new Error('"apiKey" is required');
        }
        if (!username) {
            throw new Error('"username" is required');
        }

        this.SMS = Africastalking({ apiKey, username }).SMS;
    }

    send({ recipients, message }) {
        return new Promise((resolve, reject) => {
            const listOfRecipients = recipients.map(
                (recipient, index) => `+${recipient}`
            );

            const options = {
                to: listOfRecipients,
                message,
                enqueue: true,
            };

            this.SMS.send(options)
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
module.exports = SMS;
