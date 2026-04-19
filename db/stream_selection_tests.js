const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addStreamSelectionTest({ user_id }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TESTS(user_id) VALUES(?)", [user_id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionTest: ${error}`));
}

function addStreamSelectionTestAnswer({ stream_selection_test_id, question, answer=null }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TEST_ANSWERS(stream_selection_test_id,question,answer) VALUES(?,?,?)", [
        stream_selection_test_id,
        question,
        answer,
    ]).catch((error) => logger.error(`addStreamSelectionTestAnswer: ${error}`));
}

function updateStreamSelectionTestResultById({ id, result }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_TESTS set result=? WHERE id=?", [result, id]).catch((error) =>
        logger.error(`updateStreamSelectionTestResultById: ${error}`),
    );
}

function getLatestStreamSelectionTestByUserId({ user_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TESTS WHERE user_id=? ORDER BY id DESC LIMIT 1", [user_id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getLatestStreamSelectionTestByUserId: ${error}`));
}

function getStreamSelectionTestsByUserId({ user_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TESTS WHERE user_id=? ORDER BY id DESC ", [user_id]).catch((error) =>
        logger.error(`getLatestStreamSelectionTestByUserId: ${error}`),
    );
}

function getStreamSelectionTestAnswersByStreamSelectionTestId({ stream_selection_test_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TEST_ANSWERS WHERE stream_selection_test_id=? ORDER BY id DESC ", [
        stream_selection_test_id,
    ]).catch((error) => logger.error(`getLatestStreamSelectionTestByUserId: ${error}`));
}

module.exports = {
    addStreamSelectionTest,
    addStreamSelectionTestAnswer,
    updateStreamSelectionTestResultById,
    getLatestStreamSelectionTestByUserId,
    getStreamSelectionTestsByUserId,
    getStreamSelectionTestAnswersByStreamSelectionTestId,
};
