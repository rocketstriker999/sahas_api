const { logger } = require("sequelize/lib/utils/logger");

let paymentGateWayPayLoads = [];

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

//freeze
function removePaymentGateWayPayLoadsByIds({ ids }) {
    paymentGateWayPayLoads?.filter(({ transaction }) => !ids.includes(transaction?.id));
    logger.info(paymentGateWayPayLoads);
}

module.exports = { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, getPaymentGateWayPayLoadById, removePaymentGateWayPayLoadsByIds };
