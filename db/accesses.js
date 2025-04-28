const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");
const { param } = require("../routes/transaction");

function addAccess(transaction) {
    return executeSQLQueryParameterized(`INSERT INTO USER_PRODUCT_ACCESSES (user_id, product_id, transaction_id, validity) VALUES (?, ?, ?, ?)`, [
        transaction.user_id,
        transaction.product_id,
        transaction.id,
        transaction.product_access_validity,
    ]).catch((error) => {
        logger.error(`addAccess: ${error}`);
        return false;
    });
}

//temporarty and need to remove later
function addAccessTemp(transaction) {
    return executeSQLQueryParameterized(`INSERT INTO USER_PRODUCT_ACCESSES (user_id, product_id, transaction_id, validity,company) VALUES (?, ?, ?, ?, ?)`, [
        transaction.user_id,
        transaction.product_id,
        transaction.company,
        transaction.id,
        transaction.validity,
    ]).catch((error) => {
        logger.error(`addAccessTemp: ${error}`);
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

function verifyAccessByTokenForChapter(token, chapterId) {
    return executeSQLQueryParameterized(
        `SELECT USER_PRODUCT_ACCESSES.id FROM USER_PRODUCT_ACCESSES JOIN USERS ON USER_PRODUCT_ACCESSES.user_id = USERS.id JOIN MAPPING_PRODUCT_COURSES ON USER_PRODUCT_ACCESSES.product_id = MAPPING_PRODUCT_COURSES.product_id JOIN MAPPING_COURSE_SUBJECTS ON MAPPING_PRODUCT_COURSES.course_id = MAPPING_COURSE_SUBJECTS.course_id JOIN MAPPING_SUBJECT_CHAPTERS ON MAPPING_COURSE_SUBJECTS.subject_id = MAPPING_SUBJECT_CHAPTERS.subject_id JOIN CHAPTERS ON MAPPING_SUBJECT_CHAPTERS.chapter_id = CHAPTERS.id WHERE USER_PRODUCT_ACCESSES.validity >= CURDATE() AND USERS.token = ? AND CHAPTERS.id = ?`,
        [token, chapterId]
    )
        .then((result) => (result.length > 0 ? true : false))
        .catch((error) => {
            logger.error(`verifyAccessByTokenForChapter: ${error}`);
            return false;
        });
}

function getAccessesByToken(token) {
    if (!token) return [];
    return executeSQLQueryParameterized(
        `SELECT 
    USER_PRODUCT_ACCESSES.product_id,
    USER_PRODUCT_ACCESSES.transaction_id,
    TRANSACTIONS.invoice
FROM 
    USERS
JOIN 
    USER_PRODUCT_ACCESSES 
    ON USERS.id = USER_PRODUCT_ACCESSES.user_id 
    AND USERS.token = ?
LEFT JOIN 
    TRANSACTIONS 
    ON TRANSACTIONS.id = USER_PRODUCT_ACCESSES.transaction_id`,
        [token]
    ).catch((error) => {
        logger.error(`getAccessesByToken: ${error}`);
        return [];
    });
}

function getAccessByTransactionId(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_PRODUCT_ACCESSES WHERE transaction_id=?`, [transactionId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getAccessByTransactionId: ${error}`);
            return false;
        });
}
//temp
function getUserProductAccessData(params) {
    let query = `SELECT USER_PRODUCT_ACCESSES.id AS userProductAccess_id, USER_PRODUCT_ACCESSES.company AS userProductAccess_company, USER_PRODUCT_ACCESSES.validity AS userProductAccess_validity, USERS.id AS user_id, USERS.name AS name, USERS.email AS email, USERS.phone AS phone, PRODUCTS.id AS product_id, PRODUCTS.title AS product_title FROM USER_PRODUCT_ACCESSES INNER JOIN USERS ON USER_PRODUCT_ACCESSES.user_id = USERS.id INNER JOIN PRODUCTS ON USER_PRODUCT_ACCESSES.product_id = PRODUCTS.id`;
    if(Object.keys(params).length){
        query = [
            query,
            Object.entries({
                ...params,                
            })
                .map(([key, value]) => `${key} LIKE '%${value}%'`)
                .join(" AND "),
        ].join(" WHERE ")
    }
    query = query + ' Order By USER_PRODUCT_ACCESSES.id DESC'
    return executeSQLQueryParameterized(
            query,
        []
    )
        .then((result) => {
            return result;
        })
        .catch((error) => {
            logger.error(`getUserProductAccessDatas: ${error}`);
            return false;
        });
}

module.exports = {
    addAccess,
    addAccessTemp,
    getAccessByProductIdAndToken,
    verifyAccessByTokenForChapter,
    getAccessesByToken,
    getAccessByTransactionId,
    getUserProductAccessData,
};