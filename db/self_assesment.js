const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getSelfAssesmentCatelogue({ title, background_color = null }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECTS(title,background_color) VALUES(?,?)`, [title, background_color])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addSubject: ${error}`));
}

module.exports = { addSubject, updateSubjectById, getAllSubjects, getSubjectById };
