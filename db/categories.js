const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCategoriesForCache() {
    return executeSQLQueryParameterized(
        `SELECT CATEGORIES.*, (SELECT COUNT(*) FROM PRODUCTS WHERE PRODUCTS.category_id = CATEGORIES.id) AS products_count FROM CATEGORIES ORDER BY view_index ASC`
    ).catch((error) => {
        logger.error(`executeSQLQueryParameterized: ${error}`);
        return [];
    });
}

module.exports = { getAllCategoriesForCache };
