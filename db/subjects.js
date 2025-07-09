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
    return executeSQLQueryParameterized(
        `SELECT  table_subjects.id , table_subjects.title ,table_mapping_course_subjects.view_index from COURSE_SUBJECTS table_mapping_course_subjects INNER JOIN SUBJECTS table_subjects ON table_mapping_course_subjects.subject_id=table_subjects.id where table_mapping_course_subjects.course_id=?`,
        [courseId]
    ).catch((error) => {
        logger.error(`getSubjectsByCourseId: ${error}`);
        return [];
    });
}

function getAllSubjects() {
    return executeSQLQueryParameterized(
        `SELECT COURSE_SUBJECTS.*,
            (SELECT COUNT(*) FROM SUBJECT_CHAPTERS WHERE SUBJECT_CHAPTERS.subject_id = COURSE_SUBJECTS.id) AS chapters_count,
            (SELECT COUNT(*) FROM MEDIA WHERE subject_id = COURSE_SUBJECTS.id WHERE type='VIDEO' ORDER BY view_index) AS demo_videos_count,   
            (SELECT COUNT(*) FROM MEDIA WHERE subject_id = COURSE_SUBJECTS.id WHERE type='PDF' ORDER BY view_index) AS demo_pdfs_count,   
            FROM COURSE_SUBJECTS WHERE active = TRUE ORDER BY view_index ASC`
    ).catch((error) => {
        logger.error(`getAllSubjects: ${error}`);
        return [];
    });
}

module.exports = { getSubjectsCountByProductId, getSubjectsByCourseId, getAllSubjects };
