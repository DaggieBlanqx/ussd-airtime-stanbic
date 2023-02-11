const config = require('config');
const Africastalking = require('africastalking');

const AT = Africastalking(config.get('AT').default).SMS;

const text = 'Click https://twitter.com/intent/tweet?Hello world! #builtWithAT @AfricasTalking @GrahamIngokho @m_k_global @daggieblanqx @LoiseKimwe SMS|USSD|Airtime|Voice';

const sendSMS = async () => {
    const output = await AT.send({
        to: ['+254705212848'],
        message: text,
        enqueue: true,
    });
    console.log({ output });
};

sendSMS();
