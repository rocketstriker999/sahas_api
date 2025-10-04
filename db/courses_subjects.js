const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getCourseSubjects({ course_id }) {
    return executeSQLQueryParameterized(
        `SELECT * FROM COURSES_SUBJECTS LEFT JOIN SUBJECTS ON COURSES_SUBJECTS.subject_id=SUBJECTS.id WHERE COURSES_SUBJECTS.course_id=? ORDER BY COURSES_SUBJECTS.view_index ASC`,
        [course_id]
    ).catch((error) => {
        logger.error(`getCourseSubjects: ${error}`);
        return [];
    });
}

//freeze
function updateCoursesSubjectsViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE COURSES_SUBJECTS SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateCoursesSubjectsViewIndexById: ${error}`)
    );
}

module.exports = {
    getCourseSubjects,
    updateCoursesSubjectsViewIndexById,
};
