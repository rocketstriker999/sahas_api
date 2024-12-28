const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getChaptersBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_chapters.id,table_chapters.title,table_chapters.content_id from MAPPING_SUBJECT_CHAPTERS table_mapping_subject_chapters INNER JOIN CHAPTERS table_chapters ON table_mapping_subject_chapters.chapter_id=table_chapters.id where table_mapping_subject_chapters.subject_id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getChaptersBySubjectId: ${error}`));
}
module.exports = { getChaptersBySubjectId };
