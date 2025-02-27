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

//temporarty and need to remove later
function addAccessTemp(transaction) {
    return executeSQLQueryParameterized(`INSERT INTO USER_PRODUCT_ACCESSES (user_id, product_id, transaction_id, validity) VALUES (?, ?, ?, ?)`, [
        transaction.user_id,
        transaction.product_id,
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
        `SELECT TRANSACTIONS.invoice, USER_PRODUCT_ACCESSES.id,USER_PRODUCT_ACCESSES.product_id FROM USERS JOIN USER_PRODUCT_ACCESSES ON USERS.id = USER_PRODUCT_ACCESSES.user_id AND USERS.token = ? JOIN TRANSACTIONS ON TRANSACTIONS.product_id=USER_PRODUCT_ACCESSES.product_id`,
        [token]
    ).catch((error) => {
        logger.error(`getAccessesByToken: ${error}`);
        return [];
    });
}

module.exports = { addAccess, addAccessTemp, getAccessByProductIdAndToken, verifyAccessByTokenForChapter, getAccessesByToken };
