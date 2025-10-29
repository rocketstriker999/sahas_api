const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { refresh } = require("../libs/cacher");

const paymentGateWayPayLoads = [];

//freeze
function addPaymentGateWayPayLoad(paymentGateWayPayLoad) {
    paymentGateWayPayLoads.push(paymentGateWayPayLoad);
    refresh(CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS);
}

module.exports = { addPaymentGateWayPayLoad };
