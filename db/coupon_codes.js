const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCouponCodes() {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODES`).catch((error) => {
        logger.error(`getAllCouponCodes: ${error}`);
        return false;
    });
}

function deleteCouponCodeById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM COUPON_CODES WHERE id=?`, [id]).catch((error) => logger.error(`getAllCouponCodes: ${error}`));
}

module.exports = {
    getAllCouponCodes,
    deleteCouponCodeById,
};
