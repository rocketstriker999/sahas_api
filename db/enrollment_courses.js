const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentCoursesByEnrollmentId({ enrollment_id }) {
    return executeSQLQueryParameterized(
        `SELECT ENROLLMENT_COURSES.*,USERS.full_name AS created_by_full_name FROM ENROLLMENT_COURSES LEFT JOIN USERS ON ENROLLMENT_COURSES.created_by=USERS.id WHERE ENROLLMENT_COURSES.enrollment_id=? ORDER BY ENROLLMENT_COURSES.id DESC`,
        [enrollment_id]
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

function deleteEnrollmentCourseByEnrollmentCourseId(enrollmentCourseId) {
    return executeSQLQueryParameterized(`DELETE FROM ENROLLMENT_COURSES WHERE id=? `, [enrollmentCourseId]).catch((error) => {
        logger.error(`deleteEnrollmentCourseByEnrollmentCourseId: ${error}`);
    });
}

module.exports = {
    addEnrollmentCourse,
    getEnrollmentCoursesByEnrollmentId,
    deleteEnrollmentCourseByEnrollmentCourseId,
};
