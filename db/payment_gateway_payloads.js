const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function addPaymentGateWayPayLoad({ id, user_id, course_id, original, coupon_code_id, discount, cgst, sgst, amount, validity, validity_type, hash }) {
    return executeSQLQueryParameterized(
        "INSERT INTO PAYMENT_GATEWAY_PAYLOADS(id,user_id, course_id,original, coupon_code_id, discount, cgst, sgst, amount, validity, validity_type, hash ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
        [id, user_id, course_id, original, coupon_code_id, discount, cgst, sgst, amount, validity, validity_type, hash]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addPaymentGateWayPayLoad: ${error}`));
}

module.exports = { addPaymentGateWayPayLoad };
