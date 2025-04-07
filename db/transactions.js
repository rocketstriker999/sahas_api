const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function createTransaction(transaction) {
    return executeSQLQueryParameterized(
        `INSERT INTO TRANSACTIONS ( user_id,product_id, price, discounted,coupon_id,benifit, sgst, cgst,pay,product_access_validity) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
            transaction.userId,
            transaction.productId,
            transaction.price,
            transaction.discounted,
            transaction.couponId || null,
            transaction.benifit,
            transaction.sgst,
            transaction.cgst,
            transaction.pay,
            transaction.productAccessValidity,
        ]
    )
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`createTransaction: ${error}`);
            return false;
        });
}

function updateTransactionStatus(transactionId, status) {
    return executeSQLQueryParameterized(`UPDATE TRANSACTIONS SET status='${status.toUpperCase()}' WHERE id=?`, [transactionId]).catch((error) => {
        logger.error(`updateTransactionStatus: ${error}`);
        return false;
    });
}

function updateTransactionHash(transactionId, hash) {
    return executeSQLQueryParameterized(`UPDATE TRANSACTIONS SET hash='${hash}' WHERE id=?`, [transactionId]).catch((error) => {
        logger.error(`updateTransactionHash: ${error}`);
        return false;
    });
}

function getTransactionById(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM TRANSACTIONS WHERE id=?`, [transactionId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getTransactionById: ${error}`);
            return false;
        });
}

function getAllTransaction() {
    console.log("getAllTransaction query function called");
    return executeSQLQueryParameterized(`SELECT 
        table_transactions.*, 
        table_users.name AS user_name, 
        table_users.email AS user_email, 
        table_users.phone AS user_phone, 
        table_users.address AS user_address, 
        table_products.title AS product_title, 
        table_products.description AS product_description, 
        table_products.image AS product_image, 
        table_products.price AS product_price, 
        table_products.discounted AS product_discounted, 
        table_products.access_validity AS product_access_validity 
    FROM TRANSACTIONS table_transactions 
    INNER JOIN USERS table_users 
    ON table_transactions.user_id = table_users.id 
    INNER JOIN PRODUCTS table_products 
    ON table_transactions.product_id = table_products.id`)
    .then((result) => {
        console.log("SQL result:", result); 
        // Removed incorrect logger.error line
        return result;
    })
    .catch((error) => {
        console.log("Error in getAllTransaction:", error);
        logger.error(`getAllTransaction: ${error}`);
        return []; 
    });
}

module.exports = { createTransaction, updateTransactionStatus, getTransactionById, updateTransactionHash, getAllTransaction };
