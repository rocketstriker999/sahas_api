const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getCoursesByProductId(productId) {
    return executeSQLQueryParameterized(
        `SELECT  table_courses.id , table_courses.title from MAPPING_PRODUCT_COURSES table_mapping_product_courses INNER JOIN COURSES table_courses ON table_mapping_product_courses.course_id=table_courses.id where table_mapping_product_courses.product_id=?`,
        [productId]
    ).catch((error) => {
        logger.error(`getCoursesByProductId: ${error}`);
        return [];
    });
}

function getCourseByProductIdAndCourseId(productId, courseId) {
    return executeSQLQueryParameterized(
        `SELECT  table_courses.id , table_courses.title from MAPPING_PRODUCT_COURSES table_mapping_product_courses INNER JOIN COURSES table_courses ON table_mapping_product_courses.course_id=table_courses.id where table_mapping_product_courses.course_id=? AND table_mapping_product_courses.product_id=?`,
        [courseId, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getCourseByProductIdAndCourseId: ${error}`);
            return [];
        });
}

module.exports = { getCoursesByProductId, getCourseByProductIdAndCourseId };
