const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getMediaBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_media.* FROM SUBJECTS table_subjects INNER JOIN MEDIA table_media ON table_subjects.demo_content_id=table_media.content_id WHERE table_subjects.id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getMediaBySubjectId: ${error}`));
}

function getMediaByChapterId(chapterId) {
    return executeSQLQueryParameterized(
        `SELECT table_media.* FROM CHAPTERS table_chapters INNER JOIN MEDIA table_media ON table_chapters.content_id=table_media.content_id WHERE table_chapters.id=?`,
        [chapterId]
    ).catch((error) => logger.error(`getMediaByChapterId: ${error}`));
}

module.exports = { getMediaBySubjectId, getMediaByChapterId };
