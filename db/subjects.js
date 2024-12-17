const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getSubjectsCountByProductId(courseId) {
    return executeSQLQueryParameterized(`SELECT COUNT(id) as count FROM COURSE_SUBJECTS WHERE course_id=?`, [courseId])
        .then((result) => result[0].count)
        .catch((error) => {
            logger.error(`getSubjectsCountByProductId: ${error}`);
            return [];
        });
}

function getSubjectsByCourseId(courseId) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSE_SUBJECTS WHERE course_id=?`, [courseId]).catch((error) => {
        logger.error(`getSubjectsByCourseId: ${error}`);
        return [];
    });
}

module.exports = { getSubjectsCountByProductId, getSubjectsByCourseId };
