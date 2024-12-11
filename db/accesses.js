const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function addAccess(transaction) {
    return executeSQLQueryParameterized(
        `INSERT INTO USER_PRODUCT_ACCESS (user_id, product_id, transaction_id, validity) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 365 DAY))`,
        [transaction.user_id, transaction.product_id, transaction.id]
    ).catch((error) => {
        logger.error(`Error While Getting User: ${error}`);
        return false;
    });
}

module.exports = { addAccess };
