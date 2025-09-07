const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllproductCategories() {
    return executeSQLQueryParameterized(`SELECT PRODUCT_CATEGORIES.*, COUNT(PRODUCTS.id) AS products_count FROM PRODUCT_CATEGORIES LEFT JOIN PRODUCTS ON PRODUCTS.category = PRODUCT_CATEGORIES.id GROUP BY PRODUCT_CATEGORIES.id ORDER BY PRODUCT_CATEGORIES.view_index;
`).catch((error) => logger.error(`getAllproductCategories: ${error}`));
}

module.exports = { getAllproductCategories };
