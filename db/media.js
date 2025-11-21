const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//tested
function getMediaByChapterId({ chapter_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_MEDIA WHERE chapter_id=? ORDER BY view_index ASC`, [chapter_id]).catch((error) =>
        logger.error(`getMediaByChapterId: ${error}`)
    );
}

//tested
function getMediaById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_MEDIA WHERE id=? `, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getMediaById: ${error}`));
}

//tested
function addMedia({ chapter_id, title, cdn_url, type }) {
    return executeSQLQueryParameterized(`INSERT INTO CHAPTER_MEDIA (chapter_id,title,cdn_url,type) VALUES(?,?,?,?)`, [chapter_id, title, cdn_url, type])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addMedia: ${error}`));
}

//tested
function deleteMediaById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM CHAPTER_MEDIA WHERE id=? `, [id]).catch((error) => logger.error(`addMedia: ${error}`));
}

//tested
function updateMediaViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE CHAPTER_MEDIA SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateMediaViewIndexById: ${error}`)
    );
}

module.exports = { getMediaByChapterId, addMedia, getMediaById, deleteMediaById, updateMediaViewIndexById };
