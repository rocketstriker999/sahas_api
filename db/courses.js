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

function getAllCourses() {
    return executeSQLQueryParameterized(
        "SELECT CATEGORIZED_COURSES.*, (SELECT COUNT(*) FROM COURSE_SUBJECTS WHERE COURSE_SUBJECTS.course_id = CATEGORIZED_COURSES.id) AS subjects_count FROM CATEGORIZED_COURSES WHERE active=TRUE ORDER BY view_index ASC"
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

module.exports = { getCoursesByProductId, getCourseByProductIdAndCourseId, getAllCourses };
