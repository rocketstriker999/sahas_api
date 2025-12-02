const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addSubject({ title, background_color = null }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECTS(title,background_color) VALUES(?,?)`, [title, background_color])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addSubject: ${error}`));
}

//freeze
function updateSubjectById({ id, title, background_color = null }) {
    return executeSQLQueryParameterized(`UPDATE SUBJECTS SET title=?,background_color=? WHERE id=?`, [title, background_color, id]).catch((error) =>
        logger.error(`updateSubjectById: ${error}`)
    );
}

//freeze
function getAllSubjects() {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECTS `).catch((error) => logger.error(`getAllSubjects: ${error}`));
}

//freeze
function getSubjectById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECTS WHERE id=?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getSubjectById: ${error}`));
}

module.exports = { addSubject, updateSubjectById, getAllSubjects, getSubjectById };
