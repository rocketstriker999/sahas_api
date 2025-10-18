const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getChaptersBySubjectId({ subject_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE subject_id=? ORDER BY view_index ASC`, [subject_id]).catch((error) => {
        logger.error(`getChaptersBySubjectId: ${error}`);
        return [];
    });
}

module.exports = { getChaptersBySubjectId };
