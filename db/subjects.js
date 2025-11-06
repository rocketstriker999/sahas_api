const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addSubject({ title, background_color }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECTS(title,background_color) VALUES(?,?)`, [title, background_color])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addSubject: ${error}`));
}

//freeze
function updateSubjectById({ id, title, background_color }) {
    return executeSQLQueryParameterized(`UPDATE SUBJECTS SET title=?,background_color=? WHERE id=?`, [title, background_color, id]).catch((error) =>
        logger.error(`updateSubjectById: ${error}`)
    );
}

//freeze
function getAllSubjects() {
    return executeSQLQueryParameterized(`SELECT * FROM SUBJECTS `).catch((error) => logger.error(`getAllSubjects: ${error}`));
}

module.exports = { addSubject, updateSubjectById, getAllSubjects };
