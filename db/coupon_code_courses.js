const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getCouponCodeCoursesByCouponCodeId({ coupon_code_id }) {
    return executeSQLQueryParameterized(
        `SELECT 
    COUPON_CODE_COURSES.*, 
    COURSES.title, 
    USERS.full_name AS distributor_name
FROM COUPON_CODE_COURSES
LEFT JOIN COURSES 
    ON COUPON_CODE_COURSES.course_id = COURSES.id
LEFT JOIN USERS 
    ON COUPON_CODE_COURSES.distributor_email = USERS.email
WHERE COUPON_CODE_COURSES.coupon_code_id = ?`,
        [coupon_code_id]
    ).catch((error) => {
        logger.error(`getAllCouponCodes: ${error}`);
        return [];
    });
}

//freeze
function getCouponCodeCourseByCouponCodeAndCourseId({ code, course_id }) {
    return executeSQLQueryParameterized(
        `SELECT COUPON_CODE_COURSES.* FROM COUPON_CODES LEFT JOIN COUPON_CODE_COURSES ON COUPON_CODES.id=COUPON_CODE_COURSES.coupon_code_id WHERE COUPON_CODES.code=? AND COUPON_CODE_COURSES.course_id=? AND COUPON_CODES.active=TRUE AND (COUPON_CODE_COURSES.discount>0 OR COUPON_CODE_COURSES.validity>0)`,
        [code, course_id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCouponCodeCourseByCouponCodeAndCourseId: ${error}`));
}

//freeze
function getCouponCodeCourseById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT 
    COUPON_CODE_COURSES.*, 
    COURSES.title, 
    USERS.full_name AS distributor_name
FROM COUPON_CODE_COURSES
LEFT JOIN COURSES 
    ON COUPON_CODE_COURSES.course_id = COURSES.id
LEFT JOIN USERS 
    ON COUPON_CODE_COURSES.distributor_email = USERS.email
WHERE COUPON_CODE_COURSES.id = ?`,
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getAllCouponCodes: ${error}`));
}

//freeze
function addCouponCodeCourse({ coupon_code_id, course_id, discount, discount_type, distributor_email, commision, commision_type, validity, validity_type }) {
    return executeSQLQueryParameterized(
        `INSERT INTO COUPON_CODE_COURSES(coupon_code_id, course_id, discount, discount_type, distributor_email, commision, commision_type,validity, validity_type) VALUES(?,?,?,?,?,?,?,?,?)`,
        [coupon_code_id, course_id, discount, discount_type, distributor_email, commision, commision_type, validity, validity_type]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addCouponCodeCourse: ${error}`));
}

//freeze - need to optimizae as well
function getCouponCodeCoursesByIds({ couponCodeCourseIds }) {
    return executeSQLQueryParameterized(
        `SELECT 
    COUPON_CODE_COURSES.*, 
    COURSES.title, 
    USERS.full_name AS distributor_name
FROM COUPON_CODE_COURSES
LEFT JOIN COURSES 
    ON COUPON_CODE_COURSES.course_id = COURSES.id
LEFT JOIN USERS 
    ON COUPON_CODE_COURSES.distributor_email = USERS.email
WHERE  COUPON_CODE_COURSES.id in (${couponCodeCourseIds})`
    ).catch((error) => {
        logger.error(`getCouponCodeCoursesByIds: ${error}`);
        return [];
    });
}

//freeze
function deleteCouponCodeCourseById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM COUPON_CODE_COURSES WHERE id=?`, [id]).catch((error) =>
        logger.error(`deleteCouponCodeCourseById: ${error}`)
    );
}

//freeze
function updateCouponCodeCourseById({ id, discount, discount_type, distributor_email, commision, commision_type, validity, validity_type }) {
    return executeSQLQueryParameterized(
        `UPDATE COUPON_CODE_COURSES SET discount=?,discount_type=?,distributor_email=?,commision=?,commision_type=?,validity=?,validity_type=? WHERE id=?`,
        [discount, discount_type, distributor_email, commision, commision_type, validity, validity_type, id]
    ).catch((error) => logger.error(`updateCouponCodeCourseById: ${error}`));
}

module.exports = {
    getCouponCodeCoursesByCouponCodeId,
    addCouponCodeCourse,
    getCouponCodeCoursesByIds,
    deleteCouponCodeCourseById,
    updateCouponCodeCourseById,
    getCouponCodeCourseById,
    getCouponCodeCourseByCouponCodeAndCourseId,
};
