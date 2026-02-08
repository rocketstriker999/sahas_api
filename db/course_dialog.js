const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getCourseDialogByCourseId({ title, heading, description, active, media_url, redirect_url = null, course_id }) {
    return executeSQLQueryParameterized(`UPDATE COURSE_DIALOG SET title=?,heading=?,description=?,active=?,media_url=?,redirect_url=? WHERE course_id=?`, [
        title,
        heading,
        description,
        active,
        media_url,
        redirect_url,
        course_id,
    ]).catch((error) => logger.error(`getCourseDialogByCourseId: ${error}`));
}
module.exports = {
    getCourseDialogByCourseId,
};
