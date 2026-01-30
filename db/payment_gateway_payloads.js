let paymentGateWayPayLoads = [];

//freeze
function addPaymentGateWayPayLoad(paymentGateWayPayLoad) {
    paymentGateWayPayLoads.push(paymentGateWayPayLoad);
}

//freeze
function getAllNonVerifiedPaymentGateWayPayLoads() {
    const nonVerifiedPaymentGateWayPayLoads = [...paymentGateWayPayLoads];
    paymentGateWayPayLoads = [];
    return nonVerifiedPaymentGateWayPayLoads;
}

//freeze
function getPaymentGateWayPayLoadById({ id }) {
    return paymentGateWayPayLoads?.find(({ transaction }) => transaction?.id == id);
}

module.exports = { addPaymentGateWayPayLoad, getAllNonVerifiedPaymentGateWayPayLoads, getPaymentGateWayPayLoadById };
