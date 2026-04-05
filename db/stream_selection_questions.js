const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addStreamSelectionQuestion({ category_id, question }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_QUESTIONS(category_id,question) VALUES(?,?)", [category_id, question])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionQuestion: ${error}`));
}

//freeze
function updatetreamSelectionQuestionViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_QUESTIONS SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updatetreamSelectionQuestionViewIndexById: ${error}`),
    );
}

//freeze
function updateStreamSelectionQuestionById({ id, question }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_QUESTIONS SET question=? WHERE id=?", [question, id]).catch((error) =>
        logger.error(`updateStreamSelectionQuestionById: ${error}`),
    );
}

//freeze
function getStreamSelectionQuestionById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTIONS  WHERE id=?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getStreamSelectionQuestionById: ${error}`));
}

//freeze
function getStreamSelectionQuestionsByCategoryId({ category_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTIONS  WHERE category_id=?", [category_id]).catch((error) =>
        logger.error(`getStreamSelectionQuestionById: ${error}`),
    );
}

//freeze
function getStreamSelectionQuestionsCountByCategoryId({ category_id }) {
    return executeSQLQueryParameterized("SELECT COUNT(*) as count FROM STREAM_SELECTION_QUESTIONS  WHERE category_id=?", [category_id])
        .then(([result]) => result.count)
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
function removeStreamSelectionQuestionOptionByQuestionId({ question_id }) {
    return executeSQLQueryParameterized("DELETE FROM STREAM_SELECTION_QUESTION_OPTIONS WHERE question_id=?", [question_id])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionQuestionOption: ${error}`));
}

//freeze
function getStreamSelectionQuestionOptionsByQuestionId({ question_id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_OPTIONS WHERE question_id=?", [question_id]).catch((error) =>
        logger.error(`getStreamSelectionQuestionOptionsByQuestionId: ${error}`),
    );
}

//freeze
function deleteStreamSelectionQuestionById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM STREAM_SELECTION_QUESTIONS WHERE id=?", [id]).catch((error) =>
        logger.error(`deleteStreamSelectionQuestionById: ${error}`),
    );
}

//freeze
function deleteStreamSelectionQuestionOptionsByQuestionId({ question_id }) {
    return executeSQLQueryParameterized("DELETE FROM STREAM_SELECTION_QUESTION_OPTIONS WHERE question_id=?", [question_id]).catch((error) =>
        logger.error(`deleteStreamSelectionQuestionById: ${error}`),
    );
}

module.exports = {
    addStreamSelectionQuestion,
    addStreamSelectionQuestionOption,
    getStreamSelectionQuestionById,
    getStreamSelectionQuestionOptionsByQuestionId,
    getAllStreamSelectionQuestions,
    deleteStreamSelectionQuestionById,
    deleteStreamSelectionQuestionOptionsByQuestionId,
    getStreamSelectionQuestionsByCategoryId,
    updateStreamSelectionQuestionById,
    removeStreamSelectionQuestionOptionByQuestionId,
    getStreamSelectionQuestionsCountByCategoryId,
    updatetreamSelectionQuestionViewIndexById,
};
