const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addTestConfiguration({ timer_minutes, size, questions_pool }) {
    return executeSQLQueryParameterized(`INSERT INTO TEST_CONFIGURATIONS(timer_minutes,size,questions_pool) VALUES(?,?,?)`, [
        timer_minutes,
        size,
        questions_pool,
    ])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addTestConfiguration: ${error}`));
}

//freeze
function getTestConfigurationById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM TEST_CONFIGURATIONS WHERE id=?`, [id]).catch((error) =>
        logger.error(`getTestConfigurationById: ${error}`),
    );
}

module.exports = { addTestConfiguration, getTestConfigurationById };
