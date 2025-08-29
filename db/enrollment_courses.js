const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getEnrollmentCoursesByEnrollmentId({ enrollment_id }) {
    return executeSQLQueryParameterized(
        `SELECT ENROLLMENT_COURSES.*,USERS.full_name AS created_by_full_name FROM ENROLLMENT_COURSES LEFT JOIN USERS ON ENROLLMENT_COURSES.created_by=USERS.id WHERE ENROLLMENT_COURSES.enrollment_id=? ORDER BY ENROLLMENT_COURSES.id DESC`,
        [enrollment_id]
    ).catch((error) => {
        logger.error(`getEnrollmentCoursesByEnrollmentId: ${error}`);
        return [];
    });
}

//freeze
function addEnrollmentCourse({ created_by, enrollment_id, course_id }) {
    return executeSQLQueryParameterized(`INSERT INTO ENROLLMENT_COURSES(enrollment_id,course_id,created_by) VALUES(?,?,?)`, [
        enrollment_id,
        course_id,
        created_by,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addEnrollmentCourse: ${error}`);
        });
}

//freeze
function getEnrollmentCourseById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT ENROLLMENT_COURSES.*,USERS.full_name AS created_by_full_name FROM ENROLLMENT_COURSES LEFT JOIN USERS ON ENROLLMENT_COURSES.created_by = USERS.id WHERE ENROLLMENT_COURSES.id=? ",
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getEnrollmentTransactionById: ${error}`));
}

//freeze
function deleteEnrollmentCourseById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM ENROLLMENT_COURSES WHERE id=? `, [id]).catch((error) => {
        logger.error(`deleteEnrollmentCourseById: ${error}`);
    });
}

module.exports = {
    addEnrollmentCourse,
    getEnrollmentCourseById,
    getEnrollmentCoursesByEnrollmentId,
    deleteEnrollmentCourseById,
};
