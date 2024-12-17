const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function createTransaction(product, userId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_TRANSACTIONS ( user_id,product_id, price, discounted, sgst, cgst, pay) VALUES (?,?, ?, ?, ?, ?, ?)`, [
        userId,
        product.id,
        product.price,
        product.discounted,
        product.sgst,
        product.cgst,
        product.pay,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`createTransaction: ${error}`);
            return false;
        });
}

function updateTransactionStatus(transactionId, status) {
    return executeSQLQueryParameterized(`UPDATE USER_TRANSACTIONS SET status='${status.toUpperCase()}' WHERE id=?`, [transactionId]).catch((error) => {
        logger.error(`updateTransactionStatus: ${error}`);
        return false;
    });
}

function getTransactionById(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_TRANSACTIONS WHERE id=?`, [transactionId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getTransactionById: ${error}`);
            return false;
        });
}

module.exports = { createTransaction, updateTransactionStatus, getTransactionDetails: getTransactionById };

//id - primary key auto increment ,porudct id , userid , request date time - should system date and time , status default in_progress ,amount , coupon - null
