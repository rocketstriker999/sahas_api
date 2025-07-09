const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function addAccess(transaction) {
    return executeSQLQueryParameterized(`INSERT INTO USER_PRODUCTS (user_id, product_id, transaction_id, validity) VALUES (?, ?, ?, ?)`, [
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
    return executeSQLQueryParameterized(`INSERT INTO USER_PRODUCTS (user_id, product_id, transaction_id, validity,company) VALUES (?, ?, ?, ?,?)`, [
        transaction.user_id,
        transaction.product_id,
        transaction.id,
        transaction.validity,
        transaction.company,
    ]).catch((error) => {
        logger.error(`addAccessTemp: ${error}`);
        return false;
    });
}

//temp
function getUserProductAccessData(params) {
    let query = `SELECT USER_PRODUCTS.id AS userProductAccess_id, USER_PRODUCTS.company AS userProductAccess_company,USER_PRODUCTS.active AS userProductAccess_active, USER_PRODUCTS.validity AS userProductAccess_validity, USERS.id AS user_id, USERS.name AS name, USERS.email AS email, USERS.phone AS phone, PRODUCTS.id AS product_id, PRODUCTS.title AS product_title FROM USER_PRODUCTS INNER JOIN USERS ON USER_PRODUCTS.user_id = USERS.id INNER JOIN PRODUCTS ON USER_PRODUCTS.product_id = PRODUCTS.id`;
    if (Object.keys(params).length) {
        query = [
            query,
            Object.entries({
                ...params,
            })
                .map(([key, value]) => (key === "title" ? `${key} = '${value}'` : `${key} LIKE '%${value}%'`))
                .join(" AND "),
        ].join(" WHERE ");
    }
    query = query + " Order By USER_PRODUCTS.id DESC";

    return executeSQLQueryParameterized(query, [])
        .then((result) => {
            return result;
        })
        .catch((error) => {
            logger.error(`getUserProductAccessDatas: ${error}`);
            return false;
        });
}

//temp
function updateUserProductAccessStatus(userProductAccessId, active) {
    return executeSQLQueryParameterized(`UPDATE USER_PRODUCTS SET active = ? WHERE id = ?`, [active, userProductAccessId]).catch((error) => {
        logger.error(`updateUserProductAccessStatus: ${error}`);
        return false;
    });
}

function getProfileUserProductAccessData(userId) {
    return executeSQLQueryParameterized(
        `SELECT USER_PRODUCTS.*, PRODUCTS.title AS product_title FROM USER_PRODUCTS JOIN PRODUCTS ON USER_PRODUCTS.product_id = PRODUCTS.id WHERE USER_PRODUCTS.user_id = ?`,
        [userId]
    )
        .then((result) => (result.length > 0 ? result : false))
        .catch((error) => {
            logger.error(`getProfileUserProductAccessData: ${error}`);
            return false;
        });
}

function getAccessByProductIdAndToken(productId, token) {
    return executeSQLQueryParameterized(
        `SELECT USER_PRODUCTS.transaction_id, USER_PRODUCTS.validity FROM USERS JOIN USER_PRODUCTS ON USERS.id = USER_PRODUCTS.user_id WHERE USERS.token = ? AND USER_PRODUCTS.product_id = ? AND USER_PRODUCTS.validity >= CURRENT_DATE AND USER_PRODUCTS.active = true`,
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
        `SELECT USER_PRODUCTS.id FROM USER_PRODUCTS JOIN USERS ON USER_PRODUCTS.user_id = USERS.id JOIN MAPPING_PRODUCT_COURSES ON USER_PRODUCTS.product_id = MAPPING_PRODUCT_COURSES.product_id JOIN COURSE_SUBJECTS ON MAPPING_PRODUCT_COURSES.course_id = COURSE_SUBJECTS.course_id JOIN MAPPING_SUBJECT_CHAPTERS ON COURSE_SUBJECTS.subject_id = MAPPING_SUBJECT_CHAPTERS.subject_id JOIN CHAPTERS ON MAPPING_SUBJECT_CHAPTERS.chapter_id = CHAPTERS.id WHERE USER_PRODUCTS.validity >= CURDATE() AND USERS.token = ? AND CHAPTERS.id = ?`,
        [token, chapterId]
    )
        .then((result) => (result.length > 0 ? true : false))
        .catch((error) => {
            logger.error(`verifyAccessByTokenForChapter: ${error}`);
            return false;
        });
}

function getAccessesByUserId(userId) {
    return executeSQLQueryParameterized(
        `SELECT 
    USER_PRODUCTS.product_id,
    USER_PRODUCTS.transaction_id,
    USER_TRANSACTIONS.invoice
FROM 
    USERS
JOIN 
    USER_PRODUCTS 
    ON USERS.id = USER_PRODUCTS.user_id 
    AND USERS.id = ?
LEFT JOIN 
    USER_TRANSACTIONS 
    ON USER_TRANSACTIONS.id = USER_PRODUCTS.transaction_id WHERE USER_PRODUCTS.validity >= CURDATE() AND USER_PRODUCTS.active = true`,
        [userId]
    ).catch((error) => {
        logger.error(`getAccessesByToken: ${error}`);
        return [];
    });
}

function getAccessByTransactionId(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_PRODUCTS WHERE transaction_id=?`, [transactionId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getAccessByTransactionId: ${error}`);
            return false;
        });
}

module.exports = {
    addAccess,
    addAccessTemp,
    getAccessByProductIdAndToken,
    verifyAccessByTokenForChapter,
    getAccessesByUserId,
    getAccessByTransactionId,
    getUserProductAccessData,
    getProfileUserProductAccessData,
    updateUserProductAccessStatus,
};
