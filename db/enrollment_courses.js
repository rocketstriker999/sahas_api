const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentCoursesByEnrollmentId(enrollmentId) {
    return executeSQLQueryParameterized(
        `SELECT CATEGORIZED_COURSES.id,ENROLLMENT_COURSES.created_by,ENROLLMENT_COURSES.created_on,USERS.full_name AS created_by_full_name FROM ENROLLMENT_COURSES LEFT JOIN CATEGORIZED_COURSES ON ENROLLMENT_COURSES.course_id=CATEGORIZED_COURSES.id LEFT JOIN USERS ON ENROLLMENT_COURSES.created_by=USERS.id WHERE ENROLLMENT_COURSES.enrollment_id=? ORDER BY ENROLLMENT_COURSES.id DESC`,
        [enrollmentId]
    ).catch((error) => {
        logger.error(`getEnrollmentCoursesByEnrollmentId: ${error}`);
        return [];
    });
}

function addEnrollmentCourse({ created_by, enrollment_id, course_id }) {
    return executeSQLQueryParameterized(`INSERT INTO ENROLLMENT_COURSES(enrollment_id,course_id,created_by) VALUES(?,?,?)`, [
        enrollment_id,
        course_id,
        created_by,
    ]).catch((error) => {
        logger.error(`addEnrollmentCourse: ${error}`);
    });
}

function deleteEnrollmentCourseByEnrollmentIdAndCourseId({ enrollment_id, course_id }) {
    return executeSQLQueryParameterized(`DELETE FROM ENROLLMENT_COURSES WHERE enrollment_id=? AND course_id=?`, [enrollment_id, course_id]).catch((error) => {
        logger.error(`deleteCourseByEnrollmentIdAndCourseId: ${error}`);
    });
}

module.exports = {
    addEnrollmentCourse,
    getEnrollmentCoursesByEnrollmentId,
    deleteEnrollmentCourseByEnrollmentIdAndCourseId,
};
