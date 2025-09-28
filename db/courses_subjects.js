const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getCourseSubjects({ course_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES_SUBJECTS WHERE course_id=? ORDER BY view_index ASC`, [course_id]).catch((error) => {
        logger.error(`getCourseSubjects: ${error}`);
        return [];
    });
}

module.exports = {
    getCourseSubjects,
};
