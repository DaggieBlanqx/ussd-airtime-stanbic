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
        this.accessToken = null;
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
                    this.accessToken = data.access_token || null;
                    resolve({
                        status: 'success',
                        data,
                    });
                });
        });
    }

    stkPush({ phone, amount }) {}
}

module.exports = Stanbic;
