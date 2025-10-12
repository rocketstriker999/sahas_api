const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function addSubject({ title, background_color }) {
    return executeSQLQueryParameterized(`INSERT INTO SUBJECTS(title,background_color) VALUES(?,?)`, [title, background_color])
        .then(({ insertId }) => insertId)
        .catch((error) => logger.error(`addSubject: ${error}`));
}

module.exports = { addSubject };
