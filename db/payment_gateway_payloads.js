const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { refresh } = require("../libs/cacher");

const paymentGateWayPayLoads = [];

//freeze
function addPaymentGateWayPayLoad(paymentGateWayPayLoad) {
    paymentGateWayPayLoads.push(paymentGateWayPayLoad);
    refresh(CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS);
}

//freeze
function getAllPaymentGateWayPayLoads() {
    return paymentGateWayPayLoads;
}

//freeze
function getPaymentGateWayPayLoadById({ id }) {
    return paymentGateWayPayLoads?.find(({ txnid }) => txnid == id);
}

module.exports = { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, getPaymentGateWayPayLoadById };
