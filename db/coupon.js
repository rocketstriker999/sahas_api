const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getBenifitByCouponCodeIdAndProductId(couponCodeId, productId) {
    return executeSQLQueryParameterized(
        `SELECT COUPON_PRODUCTS.value,COUPON_PRODUCTS.type,COUPON_PRODUCTS.product_access_validity FROM COUPON_PRODUCTS INNER JOIN COUPONS ON COUPON_PRODUCTS.coupon_code_id=COUPONS.id  WHERE COUPONS.id=? AND COUPON_PRODUCTS.product_id=? AND COUPONS.active=TRUE AND COUPONS.validity>=CURRENT_DATE AND COUPON_PRODUCTS.value>0`,
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
        `SELECT COUPON_DISTRIBUTORS.user_id,COUPON_DISTRIBUTORS.commision,COUPON_DISTRIBUTORS.commision_type FROM COUPON_DISTRIBUTORS WHERE coupon_code_id=? AND product_id=? AND commision>0`,
        [couponCodeId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getDistributorByCouponCodeIdAndProductId: ${error}`);
            return [];
        });
}

function getCouponCodeIdByCouponCode(couponCode) {
    return executeSQLQueryParameterized(`SELECT id FROM COUPONS WHERE coupon_code=?`, [couponCode])
        .then((result) => (result.length > 0 ? result[0].id : null))
        .catch((error) => {
            logger.error(`getCouponCodeIdByCouponCode: ${error}`);
            return [];
        });
}

module.exports = { getBenifitByCouponCodeIdAndProductId, getDistributorByCouponCodeIdAndProductId, getCouponCodeIdByCouponCode };
