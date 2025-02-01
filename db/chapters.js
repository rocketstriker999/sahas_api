const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getChaptersBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_chapters.id,table_chapters.title,table_chapters.content_id,table_mapping_subject_chapters.view_index from MAPPING_SUBJECT_CHAPTERS table_mapping_subject_chapters INNER JOIN CHAPTERS table_chapters ON table_mapping_subject_chapters.chapter_id=table_chapters.id where table_mapping_subject_chapters.subject_id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getChaptersBySubjectId: ${error}`));
}

function getAllChaptersForCache() {
    return executeSQLQueryParameterized(
        "SELECT MAPPING_SUBJECT_CHAPTERS.subject_id, CHAPTERS.id, CHAPTERS.title, CHAPTERS.content_id, (SELECT COUNT(*) FROM CONTENT_VIDEOS WHERE CONTENT_VIDEOS.content_id = CHAPTERS.content_id) AS videos_count, (SELECT COUNT(*) FROM CONTENT_PDFS WHERE CONTENT_PDFS.content_id = CHAPTERS.content_id) AS pdfs_count FROM MAPPING_SUBJECT_CHAPTERS INNER JOIN CHAPTERS ON MAPPING_SUBJECT_CHAPTERS.chapter_id = CHAPTERS.id"
    ).catch((error) => {
        logger.error(`getAllChapters: ${error}`);
        return [];
    });
}

module.exports = { getChaptersBySubjectId, getAllChaptersForCache };
