const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addStreamSelectionQuestion({ question }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_QUESTIONS(question) VALUES(?)", [question])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionQuestion: ${error}`));
}

//freeze
function getStreamSelectionQuestionById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTIONS  WHERE id=?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getStreamSelectionQuestionById: ${error}`));
}

//freeze
function getAllStreamSelectionQuestions() {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTIONS ").catch((error) => {
        logger.error(`getStreamSelectionQuestionById: ${error}`);
        return [];
    });
}

//freeze
function addStreamSelectionQuestionOption({ question_id, option }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_QUESTION_OPTIONS(question_id,\`option\`) VALUES(?,?)", [question_id, option])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionQuestionOption: ${error}`));
}

//freeze
function getStreamSelectionQuestionOptionByQuestionId({ question_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_OPTIONS WHERE question_id=?", [question_id]).catch((error) =>
        logger.error(`getStreamSelectionQuestionOptionByQuestionId: ${error}`),
    );
}

module.exports = {
    addStreamSelectionQuestion,
    addStreamSelectionQuestionOption,
    getStreamSelectionQuestionById,
    getStreamSelectionQuestionOptionByQuestionId,
    getAllStreamSelectionQuestions,
};
