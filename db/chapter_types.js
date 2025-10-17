const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllChapterTypes() {
    return executeSQLQueryParameterized("SELECT * FROM CHAPTER_TYPES ORDER BY view_index ASC").catch((error) => {
        logger.error(`getAllChapterTypes: ${error}`);
        return [];
    });
}

module.exports = { getAllChapterTypes };
