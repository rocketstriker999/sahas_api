const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getSubjectsCountByProductId(courseId) {
    return executeSQLQueryParameterized(`SELECT COUNT(id) as count FROM MAPPING_COURSE_SUBJECTS WHERE course_id=?`, [courseId])
        .then((result) => result[0].count)
        .catch((error) => {
            logger.error(`getSubjectsCountByProductId: ${error}`);
            return [];
        });
}

function getSubjectsByCourseId(courseId) {
    return executeSQLQueryParameterized(
        `SELECT  table_subjects.id , table_subjects.title ,table_subjects.demo_content_id,table_mapping_course_subjects.view_index from MAPPING_COURSE_SUBJECTS table_mapping_course_subjects INNER JOIN SUBJECTS table_subjects ON table_mapping_course_subjects.subject_id=table_subjects.id where table_mapping_course_subjects.course_id=?`,
        [courseId]
    ).catch((error) => {
        logger.error(`getSubjectsByCourseId: ${error}`);
        return [];
    });
}

module.exports = { getSubjectsCountByProductId, getSubjectsByCourseId };
