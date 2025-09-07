const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllproductCategories() {
    return executeSQLQueryParameterized(`SELECT * FROM PRODUCT_CATEGORIES ORDER BY view_index `, [chapterId, mediaId]).catch((error) =>
        logger.error(`getAllproductCategories: ${error}`)
    );
}

module.exports = { getAllproductCategories };
