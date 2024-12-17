const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getChaptersBySubjectId(subjectId) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE subject_id=?`, [subjectId]).catch((error) =>
        logger.error(`addInvoice: ${error}`)
    );
}
module.exports = { getChaptersBySubjectId };
