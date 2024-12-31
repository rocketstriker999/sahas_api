const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function createTransaction(transaction) {
    return executeSQLQueryParameterized(
        `INSERT INTO USER_TRANSACTIONS ( user_id,product_id, price, discounted,coupon,benifit, sgst, cgst,pay) VALUES (?,?,?,?,?,?,?,?,?)`,
        [
            transaction.userId,
            transaction.productId,
            transaction.price,
            transaction.discounted,
            transaction.couponCode,
            transaction.benifit,
            transaction.sgst,
            transaction.cgst,
            transaction.pay,
        ]
    )
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

function updateTransactionHash(transactionId, hash) {
    return executeSQLQueryParameterized(`UPDATE USER_TRANSACTIONS SET hash='${hash}' WHERE id=?`, [transactionId]).catch((error) => {
        logger.error(`updateTransactionHash: ${error}`);
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

module.exports = { createTransaction, updateTransactionStatus, getTransactionById, updateTransactionHash };
