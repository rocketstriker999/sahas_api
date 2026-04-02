const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllStreamSelectionQuestionCategories() {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_CATEGORIES ORDER BY view_index ASC").catch((error) =>
        logger.error(`getAllStreamSelectionQuestionCategories: ${error}`),
    );
}

//freeze
function addStreamSelectionQuestionCategory({ title, active }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_QUESTION_CATEGORIES(title,active) VALUES(?,?) ", [title, active])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addStreamSelectionQuestionCategory: ${error}`);
            return false;
        });
}

//freeze
function getStreamSelectionQuestionCategoryById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_QUESTION_CATEGORIES WHERE id = ?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getStreamSelectionQuestionCategoryById: ${error}`));
}

//freeze
function deleteStreamSelectionQuestionCategoryById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM STREAM_SELECTION_QUESTION_CATEGORIES WHERE id=?", [id]).catch((error) =>
        logger.error(`deleteStreamSelectionQuestionCategoryById: ${error}`),
    );
}

//freeze
function updateStreamSelectionQuestionCategoryById({ id, title, active }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_QUESTION_CATEGORIES SET title=?, active=? WHERE id=?", [title, active, id]).catch((error) =>
        logger.error(`updateStreamSelectionQuestionCategoryById: ${error}`),
    );
}

module.exports = {
    getAllStreamSelectionQuestionCategories,
    addStreamSelectionQuestionCategory,
    getStreamSelectionQuestionCategoryById,
    deleteStreamSelectionQuestionCategoryById,
    updateStreamSelectionQuestionCategoryById,
};
