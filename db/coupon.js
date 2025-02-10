const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getBenifitByCouponCodeAndProductId(couponCode, productId) {
    return executeSQLQueryParameterized(
        `SELECT MAPPING_COUPON_CODES_BENIFIT.benifit,MAPPING_COUPON_CODES_BENIFIT.benifit_type FROM MAPPING_COUPON_CODES_BENIFIT INNER JOIN COUPON_CODES ON MAPPING_COUPON_CODES_BENIFIT.coupon_code_id=COUPON_CODES.id  WHERE COUPON_CODES.coupon_code=? AND MAPPING_COUPON_CODES_BENIFIT.product_id=? AND COUPON_CODES.active=TRUE AND COUPON_CODES.validity>=CURRENT_DATE AND MAPPING_COUPON_CODES_BENIFIT.benifit>0`,
        [couponCode, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBenifitByCouponCodeAndProductId: ${error}`);
            return false;
        });
}

function getBenificiaryByCouponIdAndProductId(couponId, productId) {
    return executeSQLQueryParameterized(
        `SELECT MAPPING_COUPON_CODES_BENEFICIARY.benifit,MAPPING_COUPON_CODES_BENEFICIARY.benifit_type FROM MAPPING_COUPON_CODES_BENEFICIARY INNER JOIN COUPON_CODES ON MAPPING_COUPON_CODES_BENEFICIARY.coupon_code_id=COUPON_CODES.id WHERE MAPPING_COUPON_CODES_BENEFICIARY.coupon_id=? MAPPING_COUPON_CODES_BENEFICIARY.product_id=? AND COUPON_CODES.active=TRUE AND COUPON_CODES.validity>=CURRENT_DATE AND COUPON_CODES.user_id!=NULL AND  MAPPING_COUPON_CODES_BENEFICIARY.benifit>0`,
        [couponId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBenificiaryByCouponIdAndProductId: ${error}`);
            return [];
        });
}
module.exports = { getBenifitByCouponCodeAndProductId, getBenificiaryByCouponIdAndProductId };
