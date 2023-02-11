const config = require('config');
const Africastalking = require('africastalking');

const AT = Africastalking(config.get('AT').default).SMS;

const text = 'Hello world!\n#builtWithAT\nhttps://twitter.com/Africastalking';

const sendSMS = async () => {
    const output = await AT.send({
        to: ['+254713236060','+254795781794'],
        message: text,
        enqueue: true,
      });
    console.log({ output });
};

sendSMS();
