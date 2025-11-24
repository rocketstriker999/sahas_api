const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getCourseSubjectsByCourseId({ course_id }) {
    return executeSQLQueryParameterized(
        `SELECT COURSE_SUBJECTS.id,SUBJECTS.id AS subject_id,SUBJECTS.title,SUBJECTS.background_color,SUBJECTS.active,SUBJECTS.updated_at FROM COURSE_SUBJECTS LEFT JOIN SUBJECTS ON COURSE_SUBJECTS.subject_id=SUBJECTS.id WHERE COURSE_SUBJECTS.course_id=? ORDER BY COURSE_SUBJECTS.view_index ASC`,
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

//freeze
function addCourseSubject({ course_id, subject_id }) {
    return executeSQLQueryParameterized("INSERT INTO COURSE_SUBJECTS(course_id,subject_id) VALUES(?,?)", [course_id, subject_id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addCourseSubject: ${error}`));
}

//freeze
function getCourseSubjectById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT COURSE_SUBJECTS.id,SUBJECTS.id AS subject_id,SUBJECTS.title,SUBJECTS.background_color,SUBJECTS.active,SUBJECTS.quiz_batch_size, SUBJECTS.timer, SUBJECTS.quiz_active,SUBJECTS.updated_at FROM COURSE_SUBJECTS LEFT JOIN SUBJECTS ON COURSE_SUBJECTS.subject_id=SUBJECTS.id WHERE COURSE_SUBJECTS.id=? ORDER BY COURSE_SUBJECTS.view_index ASC`,
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCourseSubjectById: ${error}`));
}

module.exports = { getCourseSubjectsByCourseId, updateCourseSubjectViewIndexById, deleteCourseSubjectById, addCourseSubject, getCourseSubjectById };
