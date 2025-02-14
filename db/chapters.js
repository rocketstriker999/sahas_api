const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getChaptersBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_chapters.id,table_chapters.title,table_mapping_subject_chapters.view_index from MAPPING_SUBJECT_CHAPTERS table_mapping_subject_chapters INNER JOIN CHAPTERS table_chapters ON table_mapping_subject_chapters.chapter_id=table_chapters.id where table_mapping_subject_chapters.subject_id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getChaptersBySubjectId: ${error}`));
}

function getAllChaptersForCache() {
    return executeSQLQueryParameterized(
        "SELECT MAPPING_SUBJECT_CHAPTERS.subject_id, CHAPTERS.id, CHAPTERS.title, (SELECT COUNT(*) FROM MEDIA WHERE MEDIA.media_group_id = CHAPTERS.media_group_id AND MEDIA.type='video') AS videos_count, (SELECT COUNT(*) FROM MEDIA WHERE MEDIA.media_group_id = CHAPTERS.media_group_id AND MEDIA.type='pdf') AS pdfs_count FROM MAPPING_SUBJECT_CHAPTERS INNER JOIN CHAPTERS ON MAPPING_SUBJECT_CHAPTERS.chapter_id = CHAPTERS.id"
    ).catch((error) => {
        logger.error(`getAllChaptersForCache: ${error}`);
        return [];
    });
}

module.exports = { getChaptersBySubjectId, getAllChaptersForCache };
