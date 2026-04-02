const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllStreamSelectionQuestionCategories({ question }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_CATEGORIES ORDER BY view_index ASC", [question])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addStreamSelectionQuestion: ${error}`));
}

module.exports = {
    getAllStreamSelectionQuestionCategories,
};
