const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

// function createTransaction(transaction) {
//     return executeSQLQueryParameterized(
//         `INSERT INTO USER_TRANSACTIONS ( user_id,product_id, price, discounted,coupon_id,benifit, sgst, cgst,pay,product_access_validity) VALUES (?,?,?,?,?,?,?,?,?,?)`,
//         [
//             transaction.userId,
//             transaction.productId,
//             transaction.price,
//             transaction.discounted,
//             transaction.couponId || null,
//             transaction.benifit,
//             transaction.sgst,
//             transaction.cgst,
//             transaction.pay,
//             transaction.productAccessValidity,
//         ]
//     )
//         .then((result) => result.insertId)
//         .catch((error) => {
//             logger.error(`createTransaction: ${error}`);
//             return false;
//         });
// }

// function updateTransactionStatus(transactionId, status) {
//     return executeSQLQueryParameterized(`UPDATE USER_TRANSACTIONS SET status='${status.toUpperCase()}' WHERE id=?`, [transactionId]).catch((error) => {
//         logger.error(`updateTransactionStatus: ${error}`);
//         return false;
//     });
// }

// function updateTransactionHash(transactionId, hash) {
//     return executeSQLQueryParameterized(`UPDATE USER_TRANSACTIONS SET hash='${hash}' WHERE id=?`, [transactionId]).catch((error) => {
//         logger.error(`updateTransactionHash: ${error}`);
//         return false;
//     });
// }

// function getTransactionById(transactionId) {
//     return executeSQLQueryParameterized(`SELECT * FROM USER_TRANSACTIONS WHERE id=?`, [transactionId])
//         .then((result) => (result.length > 0 ? result[0] : false))
//         .catch((error) => {
//             logger.error(`getTransactionById: ${error}`);
//             return false;
//         });
// }

// function getTransactionByInvoice(invoice) {
//     return executeSQLQueryParameterized(`SELECT * FROM USER_TRANSACTIONS WHERE invoice=?`, [invoice])
//         .then((result) => (result.length > 0 ? result[0] : false))
//         .catch((error) => {
//             logger.error(`getTransactionByInvoice: ${error}`);
//             return false;
//         });
// }

// //temp
// function getTransactionCounts() {
//     const query = `SELECT
//     (SELECT COUNT(*) FROM USER_TRANSACTIONS WHERE status = 'SUCCESS') AS totalTransaction,
//     (SELECT COUNT(*) FROM USER_TRANSACTIONS WHERE status = 'SUCCESS' AND DATE(updated_at) = CURRENT_DATE) AS todayTransaction`;
//     return executeSQLQueryParameterized(query, [])
//         .then((result) => (result.length > 0 ? result[0] : { totalTransaction: 0, todayTransaction: 0 }))
//         .catch((error) => {
//             logger.error(`getTransactionCounts: ${error}`);
//             return { totalTransaction: 0, todayTransaction: 0 };
//         });
// }

// //temp
// function getAllTransactionData(params) {
//     let query = `SELECT
//             USER_TRANSACTIONS.id AS transaction_id,
//             USER_TRANSACTIONS.status AS transaction_status,
//             USER_TRANSACTIONS.pay AS transaction_pay,
//             USER_TRANSACTIONS.cgst AS transaction_cgst,
//             USER_TRANSACTIONS.sgst AS transaction_sgst,
//             USER_TRANSACTIONS.price AS transaction_basePrice,
//             USER_TRANSACTIONS.discounted AS transaction_discountedPrice,
//             USER_TRANSACTIONS.updated_at AS transaction_date,
//             USER_TRANSACTIONS.invoice AS transaction_invoice,
//             USER_TRANSACTIONS.product_access_validity AS transaction_product_access_validity,
//             USERS.id AS user_id,
//             USERS.name AS name,
//             USERS.email AS email,
//             USERS.phone AS phone,
//             PRODUCTS.id AS product_id,
//             PRODUCTS.title AS product_title,
//             USER_PRODUCTS.transaction_id AS userProductAccess_transaction_id,
//             USER_PRODUCTS.id AS userProductAccess_id,
//             USER_PRODUCTS.company AS userProductAccess_company
//         FROM USER_TRANSACTIONS
//         INNER JOIN USERS ON USER_TRANSACTIONS.user_id = USERS.id
//         INNER JOIN PRODUCTS ON USER_TRANSACTIONS.product_id = PRODUCTS.id
//         LEFT JOIN (
//             SELECT *
//             FROM USER_PRODUCTS AS inner_upa
//             WHERE inner_upa.id IN (
//                 SELECT MAX(id)
//                 FROM USER_PRODUCTS
//                 GROUP BY transaction_id
//             )
//         ) AS USER_PRODUCTS ON USER_TRANSACTIONS.id = USER_PRODUCTS.transaction_id`;

//     let dateConditions = [];
//     if (params.start_date) {
//         dateConditions.push(`USER_TRANSACTIONS.updated_at >= '${params.start_date} 00:00:00'`);
//         delete params.start_date;
//     }
//     if (params.end_date) {
//         dateConditions.push(`USER_TRANSACTIONS.updated_at <= '${params.end_date} 23:59:59'`);
//         delete params.end_date;
//     }
//     if (params.product) {
//         params["PRODUCTS.title"] = params.product;
//         delete params.product;
//     }
//     if (params.company) {
//         params["USER_PRODUCTS.company"] = params.company;
//         delete params.company;
//     }
//     return executeSQLQueryParameterized(
//         [
//             query,
//             Object.entries({
//                 ...params,
//                 "USER_TRANSACTIONS.status": "SUCCESS",
//             })
//                 .map(([key, value]) => `${key} LIKE '%${value}%'`)
//                 .concat(dateConditions)
//                 .join(" AND "),
//         ]
//             .join(" WHERE ")
//             .concat(" ORDER BY USER_TRANSACTIONS.id DESC"),
//         []
//     )
//         .then((result) => {
//             return result;
//         })
//         .catch((error) => {
//             logger.error(`getAllTransactionData: ${error}`);
//             return false;
//         });
// }

//freeze
function getTransactionsByEnrollmentId({ enrollment_id }) {
    return executeSQLQueryParameterized(
        `SELECT ENROLLMENT_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM ENROLLMENT_TRANSACTIONS LEFT JOIN USERS ON ENROLLMENT_TRANSACTIONS.created_by=USERS.id WHERE enrollment_id=?`,
        [enrollment_id]
    ).catch((error) => {
        logger.error(`getTransactionsByEnrollmentId: ${error}`);
        return [];
    });
}

function addEnrollmentTransaction({ enrollment_id, amount, cgst, sgst, created_by, note, type }) {
    return executeSQLQueryParameterized(`INSERT INTO ENROLLMENT_TRANSACTIONS(enrollment_id,amount,cgst,sgst,created_by,note,type) VALUES(?,?,?,?,?,?,?)`, [
        enrollment_id,
        amount,
        cgst,
        sgst,
        created_by,
        note,
        type,
    ])
        .then(({ row }) => row)
        .catch((error) => {
            logger.error(`addTransaction: ${error}`);
        });
}

function getEnrollmentTransactionById({ id }) {}

module.exports = { addEnrollmentTransaction, getTransactionsByEnrollmentId };
