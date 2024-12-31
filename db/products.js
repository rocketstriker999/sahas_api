const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getProductForTransaction(productId) {
    return executeSQLQueryParameterized(`SELECT id,title,price,discounted FROM PRODUCTS WHERE id=?`, [productId])
        .then((result) => result.length > 0 && result[0])
        .catch((error) => {
            logger.error(`getProductForTransaction: ${error}`);
            return false;
        });
}

function getProductsByCategory(categoryId) {
    return executeSQLQueryParameterized(`SELECT * FROM PRODUCTS WHERE category_id=?`, [categoryId]).catch((error) => {
        logger.error(`getProductsByCategory: ${error}`);
        return [];
    });
}

function getProductsByCategoryAndUser(categoryId, userId) {
    return executeSQLQueryParameterized(
        `SELECT table_products.id, table_products.title, table_products.price, table_products.discounted, CASE WHEN EXISTS (SELECT 1 FROM USER_PRODUCT_ACCESSES table_user_product_accesses WHERE table_user_product_accesses.product_id = table_products.id AND table_user_product_accesses.user_id = ? AND table_user_product_accesses.validity >= CURRENT_DATE) THEN true ELSE false END AS has_access FROM PRODUCTS table_products WHERE table_products.category_id = ?`,
        [userId, categoryId]
    ).catch((error) => {
        logger.error(`getProductsByCategoryAndUser: ${error}`);
        return [];
    });
}

function getProductsByToken(token) {
    return executeSQLQueryParameterized(
        `SELECT PRODUCTS.* FROM USERS JOIN USER_PRODUCT_ACCESSES ON USERS.id = USER_PRODUCT_ACCESSES.user_id JOIN PRODUCTS ON USER_PRODUCT_ACCESSES.product_id = PRODUCTS.id WHERE USERS.token = ? AND USER_PRODUCT_ACCESSES.validity >= CURRENT_DATE`,
        [token]
    ).catch((error) => {
        logger.error(`getProductsByToken: ${error}`);
        return [];
    });
}

function getProductById(id) {
    return executeSQLQueryParameterized(`SELECT * FROM PRODUCTS WHERE id = ? `, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getProductById: ${error}`);
            return {};
        });
}

module.exports = { getProductForTransaction, getProductsByCategory, getProductsByCategoryAndUser, getProductsByToken, getProductById };
