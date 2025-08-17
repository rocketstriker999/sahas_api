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
    return executeSQLQueryParameterized(`SELECT * FROM CATEGORIZED_COURSES`).catch((error) => {
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

function getCoursesByEnrollmentId(enrollmentId) {
    return executeSQLQueryParameterized(
        `SELECT  * FROM ENROLLMENT_COURSES LEFT JOIN CATEGORIZED_COURSES ON ENROLLMENT_COURSES.course_id=CATEGORIZED_COURSES.id WHERE ENROLLMENT_COURSES.enrollment_id=?`,
        [enrollmentId]
    ).catch((error) => {
        logger.error(`getCoursesByEnrollmentId: ${error}`);
        return [];
    });
}

function addCourse({ enrollment_id, course_id }) {
    return executeSQLQueryParameterized(`INSERT INTO ENROLLMENT_COURSES(enrollment_id,course_id) VALUES(?,?)`, [enrollment_id, course_id]).catch((error) => {
        logger.error(`addCourse: ${error}`);
    });
}

module.exports = { getCoursesByProductId, getCourseByProductIdAndCourseId, getAllCourses, getCoursesByEnrollmentId, addCourse };
