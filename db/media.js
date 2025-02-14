const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getMediaBySubjectId(subjectId) {
    return executeSQLQueryParameterized(
        `SELECT table_media.* FROM SUBJECTS table_subjects INNER JOIN MEDIA table_media ON table_subjects.media_group_id=table_media.media_group_id WHERE table_subjects.id=?`,
        [subjectId]
    ).catch((error) => logger.error(`getMediaBySubjectId: ${error}`));
}

function getMediaByChapterId(chapterId) {
    return executeSQLQueryParameterized(
        `SELECT table_media.* FROM CHAPTERS table_chapters INNER JOIN MEDIA table_media ON table_chapters.media_group_id=table_media.media_group_id WHERE table_chapters.id=?`,
        [chapterId]
    ).catch((error) => logger.error(`getMediaByChapterId: ${error}`));
}

function extractMediaBySubjectIdAndMediaId(subjectId, mediaId) {
    return executeSQLQueryParameterized(
        `SELECT MEDIA.* FROM SUBJECTS INNER JOIN MEDIA ON SUBJECTS.media_group_id=MEDIA.media_group_id WHERE SUBJECTS.id=? AND MEDIA.id=?`,
        [subjectId, mediaId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`extractMediaBySubjectIdAndMediaId: ${error}`));
}

module.exports = { getMediaBySubjectId, getMediaByChapterId, extractMediaBySubjectIdAndMediaId };
