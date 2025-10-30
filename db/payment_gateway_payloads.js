const { logger } = require("sequelize/lib/utils/logger");
const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { refresh } = require("../libs/cacher");
const logger = require("../libs/logger");

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
    logger.info(JSON.stringify(paymentGateWayPayLoads));
    return paymentGateWayPayLoads?.find(({ transaction }) => transaction?.id == id);
}

module.exports = { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, getPaymentGateWayPayLoadById };
