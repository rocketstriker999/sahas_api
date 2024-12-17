const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCategories() {
    return executeSQLQueryParameterized(`SELECT * FROM PRODUCT_CATEGORIES`).catch((error) => {
        logger.error(`executeSQLQueryParameterized: ${error}`);
        return [];
    });
}

module.exports = { getAllCategories };
