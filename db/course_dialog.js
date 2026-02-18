const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getCourseDialogByCourseId({ course_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSE_DIALOG WHERE course_id=?`, [course_id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCourseDialogByCourseId: ${error}`));
}

//freeze
function addCourseDialog({ title, heading = null, description = null, active = false, media_url, redirect_url = null, course_id, note = null }) {
    return executeSQLQueryParameterized(
        `INSERT INTO COURSE_DIALOG(course_id,title,heading,description,active,media_url,redirect_url,note) VALUES(?,?,?,?,?,?,?,?)`,
        [course_id, title, heading, description, active, media_url, redirect_url, note],
    ).catch((error) => logger.error(`addCourseDialog: ${error}`));
}

//freeze
function deleteCourseDialogByCourseId({ course_id }) {
    return executeSQLQueryParameterized(`DELETE FROM COURSE_DIALOG WHERE course_id=?`, [course_id]).catch((error) =>
        logger.error(`deleteCourseDialogByCourseId: ${error}`),
    );
}

module.exports = {
    getCourseDialogByCourseId,
    deleteCourseDialogByCourseId,
    addCourseDialog,
};
