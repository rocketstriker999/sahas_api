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

//temp
function getAllTransactionData(params) {
    let query = `SELECT
            TRANSACTIONS.id AS transaction_id,
            TRANSACTIONS.status AS transaction_status,
            TRANSACTIONS.pay AS transaction_pay,
            TRANSACTIONS.cgst AS transaction_cgst,
            TRANSACTIONS.sgst AS transaction_sgst,
            TRANSACTIONS.price AS transaction_basePrice,
            TRANSACTIONS.discounted AS transaction_discountedPrice,
            TRANSACTIONS.updated_at AS transaction_date,
            TRANSACTIONS.invoice AS transaction_invoice,
            TRANSACTIONS.product_access_validity AS transaction_product_access_validity,          
            USERS.id AS user_id,
            USERS.name AS name,
            USERS.email AS email,
            USERS.phone AS phone,
            PRODUCTS.id AS product_id,
            PRODUCTS.title AS product_title,
            USER_PRODUCT_ACCESSES.transaction_id AS userProductAccess_transaction_id,
            USER_PRODUCT_ACCESSES.company AS userProductAccess_company
        FROM TRANSACTIONS
        INNER JOIN USERS ON TRANSACTIONS.user_id = USERS.id
        INNER JOIN PRODUCTS ON TRANSACTIONS.product_id = PRODUCTS.id
        INNER JOIN USER_PRODUCT_ACCESSES ON TRANSACTIONS.id = USER_PRODUCT_ACCESSES.transaction_id`;

        let dateConditions = [];
         if (params.start_date) {
            dateConditions.push(`TRANSACTIONS.updated_at >= '${params.start_date} 00:00:00'`);
             delete params.start_date;
         }
         if (params.end_date) {
            dateConditions.push(`TRANSACTIONS.updated_at <= '${params.end_date} 23:59:59'`);
             delete params.end_date;
         }
         if (params.product) {
            params["PRODUCTS.title"] = params.product;
            delete params.product;
        }
        if (params.company) {
            params["USER_PRODUCT_ACCESSES.company"] = params.company;
            delete params.company;
        }
    return executeSQLQueryParameterized(
        [
            query,
            Object.entries({
                ...params,
                "TRANSACTIONS.status": "SUCCESS",
            })
                .map(([key, value]) => `${key} LIKE '%${value}%'`)
                .concat(dateConditions)
                .join(" AND "),
        ]
            .join(" WHERE ")
            .concat(" ORDER BY TRANSACTIONS.id DESC"),
        []
    )
        .then((result) => {
            return result;
        })
        .catch((error) => {
            logger.error(`getAllTransactionData: ${error}`);
            return false;
        });
}

module.exports = { createTransaction, updateTransactionStatus, getTransactionById, updateTransactionHash, getAllTransactionData };
