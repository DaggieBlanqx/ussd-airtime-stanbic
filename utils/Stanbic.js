const unirest = require('unirest');

class Stanbic {
    constructor({ clientId, clientSecret }) {
        if (!clientId) {
            throw new Error('"clientId" is required');
        }
        if (!clientSecret) {
            throw new Error('"clientSecret" is required');
        }

        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.endpoints = {
            AUTH_TOKEN:
                'https://api.connect.stanbicbank.co.ke/api/sandbox/auth/oauth2/token',
            STK_PUSH:
                'https://api.connect.stanbicbank.co.ke/api/sandbox/mpesa-checkout',
        };
    }

    generateToken() {
        return new Promise((resolve, reject) => {
            unirest('POST', this.endpoints.AUTH_TOKEN)
                .headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                })
                .send(`client_id=${this.clientId}`)
                .send(`client_secret=${this.clientSecret}`)
                .send('scope=payments')
                .send('grant_type=client_credentials')
                .end(function (res) {
                    if (res.error) reject({ error: res.error });
                    const data =
                        typeof res.raw_body === 'string'
                            ? JSON.parse(res.raw_body)
                            : res.raw_body;
                    resolve({
                        status: 'success',
                        data,
                    });
                });
        });
    }

    stkPush({ phone, amount, txnNarrative, dbsReferenceId, billAccountRef }) {
        if (!phone) {
            throw new Error('"phone" is required');
        }
        if (!amount) {
            throw new Error('"amount" is required');
        }
        return new Promise(async (resolve, reject) => {
            const temp = await this.generateToken();
            const access_token = temp.data.access_token;

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            };

            const body = {
                dbsReferenceId:
                    dbsReferenceId ||
                    'Africastalking-Hackathon-Demo-REFERENCE-ID',
                billAccountRef:
                    billAccountRef ||
                    'Africastalking-Hackathon-Demo-BILLING-ACCOUNT-REF',
                amount: Number(amount).toFixed(2).toString(),
                mobileNumber: phone.toString(),
                corporateNumber: '740757',
                txnNarrative: txnNarrative || 'Africastalking Hackathon Demo',
            };

            unirest('POST', this.endpoints.STK_PUSH)
                .headers(headers)
                .send(JSON.stringify(body))
                .end(function (res) {
                    if (res.error) reject({ error: res.error });
                    const data =
                        typeof res.raw_body === 'string'
                            ? JSON.parse(res.raw_body)
                            : res.raw_body;
                    resolve({
                        status: 'success',
                        data,
                    });
                });
        });
    }
}

module.exports = Stanbic;
