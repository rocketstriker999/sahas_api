const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCouponCodes() {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODES`).catch((error) => {
        logger.error(`getAllCouponCodes: ${error}`);
        return false;
    });
}

module.exports = {
    getAllCouponCodes,
};
