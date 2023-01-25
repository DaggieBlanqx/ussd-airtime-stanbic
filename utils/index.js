const StanbicAPI = require('./utils/Stanbic');
const config = require('config');

const Stanbic = new StanbicAPI(config.get('Stanbic'));

const batched = ({ amount, recipients, sender }) => {
    /// Trigger STK push, wait for 5seconds then send airtime.
};
