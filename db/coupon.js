const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getBenifitByCouponCodeIdAndProductId(couponCodeId, productId) {
    return executeSQLQueryParameterized(
        `SELECT COUPON_CODE_BENIFITS.value,COUPON_CODE_BENIFITS.type,COUPON_CODE_BENIFITS.product_access_validity FROM COUPON_CODE_BENIFITS INNER JOIN COUPON_CODES ON COUPON_CODE_BENIFITS.coupon_code_id=COUPON_CODES.id  WHERE COUPON_CODES.id=? AND COUPON_CODE_BENIFITS.product_id=? AND COUPON_CODES.active=TRUE AND COUPON_CODES.validity>=CURRENT_DATE AND COUPON_CODE_BENIFITS.value>0`,
        [couponCodeId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBenifitByCouponCodeIdAndProductId: ${error}`);
            return false;
        });
}

function getDistributorByCouponCodeIdAndProductId(couponCodeId, productId) {
    return executeSQLQueryParameterized(
        `SELECT MAPPING_COUPON_CODES_DISTRIBUTOR_BENIFIT.user_id,MAPPING_COUPON_CODES_DISTRIBUTOR_BENIFIT.commision,MAPPING_COUPON_CODES_DISTRIBUTOR_BENIFIT.commision_type FROM MAPPING_COUPON_CODES_DISTRIBUTOR_BENIFIT WHERE coupon_code_id=? AND product_id=? AND commision>0`,
        [couponCodeId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getDistributorByCouponCodeIdAndProductId: ${error}`);
            return [];
        });
}

function getCouponCodeIdByCouponCode(couponCode) {
    return executeSQLQueryParameterized(`SELECT id FROM COUPON_CODES WHERE coupon_code=?`, [couponCode])
        .then((result) => (result.length > 0 ? result[0].id : null))
        .catch((error) => {
            logger.error(`getCouponCodeIdByCouponCode: ${error}`);
            return [];
        });
}

module.exports = { getBenifitByCouponCodeIdAndProductId, getDistributorByCouponCodeIdAndProductId, getCouponCodeIdByCouponCode };
