const express = require('express');
const router = express.Router();
const { phone } = require('phone');
const config = require('config');
const RainMaker = require('./utils/index');
const Airtime = new AirtimeAPI(config.get('AT').default);


const credentials = {
    apiKey: 'b4c7c90faac0fd652ce92140f26fd6a955cbe7be09ea1a24a71c39e686943c62',
    username: 'sandbox',
};
const Africastalking = require('africastalking')(credentials);


// router.get('/', (req, res) => res.send('Hola!'));

router.post('/ussd', (req, res) => {
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';

    if (text == '') {
        response = `CON Welcome to Airtime Vendor
        1. Send Airtime
        2. Check balance`;
        
    } else if ( text == '1') {

        response = `CON Enter amount`;
        console.log(text);
       
    } else if (text.split('*').length == 2) {   
    
        if(Number.isInteger(Math.floor(text.split('*')[1]))) {
            response = `CON Enter recipients(s) separate by comma`;
        } else {
            response = `END your amount is Incorrect`
        }
      
    } else if ( text.split('*').length == 3) {
       
        const regex = /^[254]+\d{9}/;
        if(regex.test(text.split('*')[2])) {
            const recipients = text.split('*')[2];
            const amount = text.split('*')[1];
            const newPhoneNumber = phoneNumber.slice(1);
            console.log('rece', recipients);
            console.log('amount', amount);
            console.log(newPhoneNumber);
            response = `END Your recipients will receive airtime shortly`;
        } else {
            response = `END You entered Incorrect phone numbers`
        }
        
    } else if ( text == '2') {
        const balanceAmount = '30000';
        response = `END Your Account balance is ${balanceAmount}`;
      
    } 

    res.set('Content-Type: text/plain');
    res.send(response);
})

module.exports = router;
