const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getMediaByChapterId({ chapter_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_MEDIA WHERE chapter_id=? `, [chapter_id]).catch((error) =>
        logger.error(`getMediaByChapterId: ${error}`)
    );
}

function getMediaById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_MEDIA WHERE id=? `, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getMediaById: ${error}`));
}

function addMedia({ chapter_id, title, cdn_url, type }) {
    return executeSQLQueryParameterized(`INSERT INTO CHAPTER_MEDIA (chapter_id,title,cdn_url,type)`, [chapter_id, title, cdn_url, type])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addMedia: ${error}`));
}

module.exports = { getMediaByChapterId, addMedia, getMediaById };
