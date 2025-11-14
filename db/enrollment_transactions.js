const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

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

//freeze
function addEnrollmentTransaction({ enrollment_id, amount, cgst, sgst, created_by, coupon_code = null, discount = 0, note, type, image = null }) {
    return executeSQLQueryParameterized(
        `INSERT INTO ENROLLMENT_TRANSACTIONS(enrollment_id,amount,cgst,sgst,created_by,coupon_code,discount,note,type,image) VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [enrollment_id, amount, cgst, sgst, created_by, coupon_code, discount, note, type, image]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addEnrollmentTransaction: ${error}`));
}

//freeze
function updateEnrollmentTransactionInvoiceById({ id, invoice }) {
    return executeSQLQueryParameterized(`UPDATE ENROLLMENT_TRANSACTIONS SET invoice=? where id=?`, [invoice, id]).catch((error) =>
        logger.error(`updateEnrollmentTransactionInvoiceById: ${error}`)
    );
}

//freeze
function getEnrollmentTransactionById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT ENROLLMENT_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM ENROLLMENT_TRANSACTIONS LEFT JOIN USERS ON ENROLLMENT_TRANSACTIONS.created_by = USERS.id WHERE ENROLLMENT_TRANSACTIONS.id=? ",
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getEnrollmentTransactionById: ${error}`));
}

module.exports = { addEnrollmentTransaction, getTransactionsByEnrollmentId, getEnrollmentTransactionById, updateEnrollmentTransactionInvoiceById };
