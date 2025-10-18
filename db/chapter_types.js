const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllChapterTypes() {
    return executeSQLQueryParameterized("SELECT * FROM CHAPTER_TYPES ORDER BY view_index ASC").catch((error) => {
        logger.error(`getAllChapterTypes: ${error}`);
        return [];
    });
}

//freeze
function updateChapterTypeViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE CHAPTER_TYPES SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateChapterTypeViewIndexById: ${error}`)
    );
}

//freeze
function deleteChapterTypeById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM CHAPTER_TYPES  WHERE id=?", [id]).catch((error) => logger.error(`deleteChapterTypeById: ${error}`));
}

module.exports = { getAllChapterTypes, updateChapterTypeViewIndexById, deleteChapterTypeById };
