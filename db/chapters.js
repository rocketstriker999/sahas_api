const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getChaptersBySubjectId({ subject_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE subject_id=? ORDER BY view_index ASC`, [subject_id]).catch((error) => {
        logger.error(`getChaptersBySubjectId: ${error}`);
        return [];
    });
}

//freeze
function addChapter({ title, subject_id, type }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECT_CHAPTERS(title,subject_id,type) VALUES(?,?,?)`, [title, subject_id, type])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapter: ${error}`));
}

//freeze
function getChapterById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE id=?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`addChapter: ${error}`));
}

//freeze
function updateChapterViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE SUBJECT_CHAPTERS SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateChapterViewIndexById: ${error}`)
    );
}

//freeze
function deleteChapterById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM SUBJECT_CHAPTERS WHERE id=?", [id]).catch((error) => logger.error(`deleteChapterById: ${error}`));
}

//freeze
function updateChapterById({ id, title, type }) {
    return executeSQLQueryParameterized("UPDATE SUBJECT_CHAPTERS SET title=?,type=? WHERE id=?", [title, type, id]).catch((error) =>
        logger.error(`updateChapterById: ${error}`)
    );
}

module.exports = { getChaptersBySubjectId, addChapter, getChapterById, updateChapterViewIndexById, deleteChapterById, updateChapterById };
