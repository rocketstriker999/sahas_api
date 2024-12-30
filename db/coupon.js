const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function validateCouponCode(couponCode) {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODES WHERE coupon=? AND active=TRUE AND validity>=CURRENT_DATE AND value>0`, [couponCode])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getCoupon: ${error}`);
            return [];
        });
}
module.exports = { validateCouponCode };
