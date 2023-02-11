const config = require('config');
const Africastalking = require('africastalking');

const AT = Africastalking(config.get('AT').default).AIRTIME;

const sendAirtime = async () => {
    const output = await AT.send({
        maxNumRetry: 1,
        recipients: [
            {
                phoneNumber: '+254705212848',
                amount: 5,
                currencyCode: 'KES',
            },
            // {
            //     phoneNumber: '+254794735151',
            //     amount: 20,
            //     currencyCode: 'KES',
            // },
            // {
            //     phoneNumber: '+254111985166',
            //     amount: 20,
            //     currencyCode: 'KES',
            // },
        ],
    });

    console.log({ output });
};

sendAirtime();
