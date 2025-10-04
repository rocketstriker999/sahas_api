const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getCourseSubjectsByCourseId({ course_id }) {
    return executeSQLQueryParameterized(
        `SELECT * FROM COURSE_SUBJECTS LEFT JOIN SUBJECTS ON COURSE_SUBJECTS.subject_id=SUBJECTS.id WHERE COURSE_SUBJECTS.course_id=? ORDER BY COURSE_SUBJECTS.view_index ASC`,
        [course_id]
    ).catch((error) => {
        logger.error(`getCourseSubjectsByCourseId: ${error}`);
        return [];
    });
}

//freeze
function updateCourseSubjectViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE COURSE_SUBJECTS SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateCourseSubjectViewIndexById: ${error}`)
    );
}

//freeze
function deleteCourseSubjectById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM COURSE_SUBJECTS  WHERE id=?", [id]).catch((error) => logger.error(`deleteCourseSubjectById: ${error}`));
}

module.exports = { getCourseSubjectsByCourseId, updateCourseSubjectViewIndexById, deleteCourseSubjectById };
