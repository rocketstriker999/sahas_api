const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function addSubject({ title, background_color }) {
    logger.info(`INSERT INTO SUBJECTS(title,background_color) VALUES(${title},${background_color})`);
    return executeSQLQueryParameterized(`INSERT INTO SUBJECTS(title,background_color) VALUES(?,?)`, [title, background_color])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addSubject: ${error}`));
}

module.exports = { addSubject };
