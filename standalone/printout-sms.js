// Install the africastalking library from npmjs.org
const Africastalking = require('africastalking');

const AT = Africastalking({ username:'your-app-username', apiKey:'your-apikey' }).SMS;
// Get your app’s username and api key from https://account.africastalking.com

const sendSMS = async () => {
   const output = await AT.send({
     to: ['+2547xxxxxxxx','+2547yyyyyyyy'], // phone numbers
     message: 'Hello world - Build With Africastalking', // your text
     enqueue: true,
   });

   console.log({ output });
};

sendSMS();