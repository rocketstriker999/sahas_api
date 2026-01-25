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
    return executeSQLQueryParameterized(`SELECT * FROM TEST_CONFIGURATIONS WHERE id=?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getTestConfigurationById: ${error}`));
}

//freeze
function updateTestConfigurationById({ timer_minutes, size, questions_pool, id }) {
    return executeSQLQueryParameterized(`UPDATE TEST_CONFIGURATIONS SET timer_minutes=?,size=?,questions_pool=?  WHERE id=?`, [
        timer_minutes,
        size,
        questions_pool,
        id,
    ])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`updateTestConfigurationById: ${error}`));
}

module.exports = { addTestConfiguration, getTestConfigurationById, updateTestConfigurationById };
