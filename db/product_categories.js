const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllproductCategories() {
    return executeSQLQueryParameterized(`SELECT PRODUCT_CATEGORIES.*, COUNT(PRODUCTS.id) AS products_count FROM PRODUCT_CATEGORIES LEFT JOIN PRODUCTS ON PRODUCTS.category = PRODUCT_CATEGORIES.id GROUP BY PRODUCT_CATEGORIES.id ORDER BY PRODUCT_CATEGORIES.view_index;
`).catch((error) => logger.error(`getAllproductCategories: ${error}`));
}

//freeze
function getProductCategoryById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT PRODUCT_CATEGORIES.*, COUNT(PRODUCTS.id) AS products_count FROM PRODUCT_CATEGORIES LEFT JOIN PRODUCTS ON PRODUCTS.category = PRODUCT_CATEGORIES.id WHERE PRODUCT_CATEGORIES.id = ? GROUP BY PRODUCT_CATEGORIES.id ORDER BY PRODUCT_CATEGORIES.view_index`,
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getProductCategoryById: ${error}`));
}

//freeze
function addProductCategory({ title, image }) {
    return executeSQLQueryParameterized(`INSERT INTO PRODUCT_CATEGORIES(title,image) VALUES(?,?)`, [title, image])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addProductCategory: ${error}`));
}

module.exports = { getAllproductCategories, addProductCategory, getProductCategoryById };
