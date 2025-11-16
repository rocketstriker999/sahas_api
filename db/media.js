const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getMediaByChapterId({ chapter_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_MEDIA WHERE chapter_id=? `, [chapter_id]).catch((error) =>
        logger.error(`getMediaByChapterId: ${error}`)
    );
}

module.exports = { getMediaByChapterId };
