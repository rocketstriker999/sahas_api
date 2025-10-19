const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getChaptersBySubjectId({ subject_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE subject_id=? ORDER BY view_index ASC`, [subject_id]).catch((error) => {
        logger.error(`getChaptersBySubjectId: ${error}`);
        return [];
    });
}

//freeze
function addChapter({ title, subject_id, type }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECT_CHAPTERS(title,subject_id,type)`, [title, subject_id, type])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapter: ${error}`));
}

//freeze
function getChapterById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE id=?`, [id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapter: ${error}`));
}

module.exports = { getChaptersBySubjectId, addChapter, getChapterById };
