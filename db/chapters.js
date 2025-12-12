const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getChaptersBySubjectId({ subject_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECT_CHAPTERS WHERE subject_id=? ORDER BY view_index ASC ,updated_at DESC`, [subject_id]).catch(
        (error) => {
            logger.error(`getChaptersBySubjectId: ${error}`);
            return [];
        }
    );
}

//freeze
function addChapter({ title, subject_id, type, view_index = 0, quiz_attainable = false }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECT_CHAPTERS(title,subject_id,type,view_index,quiz_attainable) VALUES(?,?,?,?,?)`, [
        title,
        subject_id,
        type,
        view_index,
        quiz_attainable,
    ])
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
function updateChapterById({ id, title, type, quiz_attainable = false }) {
    return executeSQLQueryParameterized("UPDATE SUBJECT_CHAPTERS SET title=?,type=?,quiz_attainable=? WHERE id=?", [title, type, quiz_attainable, id]).catch(
        (error) => logger.error(`updateChapterById: ${error}`)
    );
}

//freeze
function getChapterBySubjectIdAndTitle({ subject_id, title }) {
    return executeSQLQueryParameterized(`SELECT title from SUBJECT_CHAPTERS WHERE subject_id=? AND title=?`, [subject_id, title])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getChapterBySubjectIdAndTitle: ${error}`));
}

module.exports = {
    getChaptersBySubjectId,
    addChapter,
    getChapterById,
    updateChapterViewIndexById,
    deleteChapterById,
    updateChapterById,
    getChapterBySubjectIdAndTitle,
};
