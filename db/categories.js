const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCategories() {
    return executeSQLQueryParameterized(
        `SELECT CATEGORIES.*, (SELECT COUNT(*) FROM CATEGORIZED_COURSES WHERE CATEGORIZED_COURSES.category_id = CATEGORIES.id) AS courses_count FROM CATEGORIES WHERE active=TRUE ORDER BY view_index ASC`
    ).catch((error) => {
        logger.error(`getAllCategories: ${error}`);
        return [];
    });
}

module.exports = { getAllCategories };
