const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function validateCouponId(couponId, productId) {
    return executeSQLQueryParameterized(
        `SELECT table_coupons.* FROM COUPONS table_coupons JOIN MAPPING_COUPON_PRODUCTS table_mapping_coupon_products WHERE table_mapping_coupon_products.coupon_id=? AND table_mapping_coupon_products.product_id=? AND table_coupons.active=TRUE AND table_coupons.validity>=CURRENT_DATE AND table_coupons.benifit>0`,
        [couponId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getCoupon: ${error}`);
            return false;
        });
}

//SELECT * FROM

function getCouponById(couponId) {
    return executeSQLQueryParameterized(`SELECT * FROM COUPONS WHERE id=?`, [couponId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getCoupon: ${error}`);
            return [];
        });
}
module.exports = { validateCouponId, getCouponById };
