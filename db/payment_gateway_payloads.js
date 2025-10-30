const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { refresh } = require("../libs/cacher");

const paymentGateWayPayLoads = [];

//freeze
function addPaymentGateWayPayLoad(paymentGateWayPayLoad) {
    paymentGateWayPayLoads.push(paymentGateWayPayLoad);
}

//freeze
function getAllPaymentGateWayPayLoads() {
    return paymentGateWayPayLoads;
}

//freeze
function getPaymentGateWayPayLoadById({ id }) {
    return paymentGateWayPayLoads?.find(({ transaction }) => transaction?.id == id);
}

module.exports = { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, getPaymentGateWayPayLoadById };
