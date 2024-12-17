const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function addAccess(transaction) {
    return executeSQLQueryParameterized(
        `INSERT INTO USER_PRODUCT_ACCESSES (user_id, product_id, transaction_id, validity) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 365 DAY))`,
        [transaction.user_id, transaction.product_id, transaction.id]
    ).catch((error) => {
        logger.error(`addAccess: ${error}`);
        return false;
    });
}

function getAccessByProductIdAndToken(productId, token) {
    return executeSQLQueryParameterized(
        `SELECT USER_PRODUCT_ACCESSES.transaction_id, USER_PRODUCT_ACCESSES.validity FROM USERS JOIN USER_PRODUCT_ACCESSES ON USERS.id = USER_PRODUCT_ACCESSES.user_id WHERE USERS.token = ? AND USER_PRODUCT_ACCESSES.product_id = ? AND USER_PRODUCT_ACCESSES.validity >= CURRENT_DATE AND USER_PRODUCT_ACCESSES.active = true`,
        [token, productId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getAccessByProductIdAndToken: ${error}`);
            return false;
        });
}

module.exports = { addAccess, getAccessByProductIdAndToken };
