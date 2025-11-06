const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getAllCouponCodes() {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODES`).catch((error) => {
        logger.error(`getAllCouponCodes: ${error}`);
        return false;
    });
}

function deleteCouponCodeById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM COUPON_CODES WHERE id=?`, [id]).catch((error) => logger.error(`deleteCouponCodeById: ${error}`));
}

//freeze
function addCouponCode({ code }) {
    return executeSQLQueryParameterized(`INSERT INTO COUPON_CODES(code) VALUES(?)`, [code])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addCouponCode: ${error}`));
}

//freeze
function updateCouponCodeById({ id, code, active }) {
    return executeSQLQueryParameterized(`UPDATE COUPON_CODES SET code=?,active=? WHERE id=?`, [code, active, id]).catch((error) =>
        logger.error(`updateCouponCodeById: ${error}`)
    );
}

//freeze
function getCouponCodeById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODES WHERE id=?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCouponCodeById: ${error}`));
}

module.exports = {
    getAllCouponCodes,
    deleteCouponCodeById,
    addCouponCode,
    getCouponCodeById,
    updateCouponCodeById,
};
