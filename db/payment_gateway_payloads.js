const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function addPaymentGateWayPayLoad({ user_id, course_id, amount, cgst, sgst, coupon_code_id, discount, validity, validity_type, hash }) {
    return executeSQLQueryParameterized(
        "INSERT INTO PAYMENT_GATEWAY_PAYLOADS(user_id, course_id, amount, cgst, sgst, coupon_code_id, discount, validity, validity_type, hash) VALUES(?)",
        [user_id, course_id, amount, cgst, sgst, coupon_code_id, discount, validity, validity_type, hash]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addPaymentGateWayPayLoad: ${error}`));
}

module.exports = { addPaymentGateWayPayLoad };
