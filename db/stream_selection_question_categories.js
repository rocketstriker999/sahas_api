const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllStreamSelectionQuestionCategories() {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_CATEGORIES ORDER BY view_index ASC").catch((error) =>
        logger.error(`getAllStreamSelectionQuestionCategories: ${error}`),
    );
}

module.exports = {
    getAllStreamSelectionQuestionCategories,
};
