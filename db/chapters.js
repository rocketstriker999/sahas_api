const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getChaptersBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_chapters.id,table_chapters.title,table_mapping_subject_chapters.view_index from MAPPING_SUBJECT_CHAPTERS table_mapping_subject_chapters INNER JOIN CHAPTERS table_chapters ON table_mapping_subject_chapters.chapter_id=table_chapters.id where table_mapping_subject_chapters.subject_id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getChaptersBySubjectId: ${error}`));
}

function getAllChapters() {
    return executeSQLQueryParameterized(
        `SELECT SUBJECT_CHAPTERS.*, 
         (SELECT COUNT(*) FROM MEDIA WHERE subject_id = COURSE_SUBJECTS.id WHERE type='VIDEO' ORDER BY view_index) AS videos_count,   
         (SELECT COUNT(*) FROM MEDIA WHERE subject_id = COURSE_SUBJECTS.id WHERE type='PDF' ORDER BY view_index) AS pdfs_count, 
        FROM SUBJECT_CHAPTERS WHERE active = TRUE ORDER BY view_index ASC`
    ).catch((error) => {
        logger.error(`getAllChapters: ${error}`);
        return [];
    });
}

module.exports = { getChaptersBySubjectId, getAllChapters };
