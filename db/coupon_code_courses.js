const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getCouponCodeCoursesByCouponCodeId({ coupon_code_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COUPON_CODE_COURSES where coupon_code_id=?`, [coupon_code_id]).catch((error) => {
        logger.error(`getAllCouponCodes: ${error}`);
        return false;
    });
}

//freeze
function addCouponCodeCourse({ code }) {
    return executeSQLQueryParameterized(`INSERT INTO COUPON_CODES(code) VALUES(?)`, [code])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addCouponCode: ${error}`));
}

module.exports = {
    getCouponCodeCoursesByCouponCodeId,
    addCouponCodeCourse,
};
