const express = require('express');
const router = express.Router();
const config = require('config');
const RainMaker = require('../utils/index');
const AirtimeAPI = require('../utils/Airtime');

const Airtime = new AirtimeAPI(config.get('AT').default);

router.get('/', (req, res) => res.send('Hola!'));

router.post('/ussd', async (req, res) => {
    try {
        const { sessionId, serviceCode, phoneNumber, text } = req.body;

        let response = '';

        if (text == '') {
            response = `CON Welcome to Airtime Vendor
        1. Send Airtime
        2. Check balance`;
        } else if (text == '1') {
            response = `CON Enter amount`;
            console.log(text);
        } else if (text.split('*').length == 2) {
            if (Number.isInteger(Math.floor(text.split('*')[1]))) {
                response = `CON Enter recipients(s) separate by comma`;
            } else {
                response = `END your amount is Incorrect`;
            }
        } else if (text.split('*').length == 3) {
            const regex = /^[254]+\d{9}/;
            if (regex.test(text.split('*')[2])) {
                const recipients = text.split('*')[2];
                const amount = text.split('*')[1];
                const newPhoneNumber = phoneNumber.slice(1);
                console.log('rece', recipients);
                console.log('amount', amount);
                console.log(newPhoneNumber);

                const inputData = {
                    amount,
                    recipients: recipients.split(','),
                    sender: newPhoneNumber,
                };

                console.log({ inputData });

                const rq = await RainMaker(inputData);

                if (rq.status === 'success') {
                    response = `END Your recipients will receive airtime shortly`;
                } else {
                    response = `END Sorry an error occurred. We are looking at it`;
                    console.trace({ rq });
                }
            } else {
                response = `END You entered Incorrect phone numbers`;
            }
        } else if (text == '2') {
            const rq = await Airtime.getBalance();
            if (rq.status === 'success') {
                const balanceAmount = rq.data.balance;
                response = `END Your Account balance is ${balanceAmount}`;
            } else {
                response = `END Sorry, an error occurred . Try again later.`;
            }
        }

        res.set('Content-Type: text/plain');
        res.send(response);
    } catch (error) {
        response = `END Eew, we caught an error. Try again later.`;
        res.set('Content-Type: text/plain');
        res.send(response);
    }
});

module.exports = router;
