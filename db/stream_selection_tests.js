const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addStreamSelectionTest({ user_id }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TESTS(user_id) VALUES(?)", [user_id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionTest: ${error}`));
}

function addStreamSelectionTestAnswer({ stream_selection_test_id, user_id }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TEST_ANSWERS(user_id) VALUES(?)", [user_id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionTest: ${error}`));
}

module.exports = {
    addStreamSelectionTest,
    addStreamSelectionTestAnswer,
};
