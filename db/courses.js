const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
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

function getAllCoursesForCache() {
    return executeSQLQueryParameterized(
        "SELECT MAPPING_PRODUCT_COURSES.product_id, COURSES.id, COURSES.title, (SELECT COUNT(*) FROM MAPPING_COURSE_SUBJECTS WHERE MAPPING_COURSE_SUBJECTS.course_id = COURSES.id) AS subjects_count FROM MAPPING_PRODUCT_COURSES INNER JOIN COURSES ON MAPPING_PRODUCT_COURSES.course_id = COURSES.id"
    ).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
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

module.exports = { getCoursesByProductId, getCourseByProductIdAndCourseId, getAllCoursesForCache };
