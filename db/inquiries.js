const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiriesByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*,USERS.full_name AS created_by_full_name FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by=USERS.id WHERE INQUIRIES.user_id=? ORDER BY INQUIRIES.id DESC",
        [userId]
    ).catch((error) => {
        logger.error(`getInquiriesByUserId: ${error}`);
        return [];
    });
}

function getInquiryByInquiryId(inquiryId) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*,USERS.full_name AS created_by_full_name FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by=USERS.id WHERE INQUIRIES.id=? ",
        [inquiryId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getInquiryByInquiryId: ${error}`);
            return [];
        });
}

function deleteInquiryById(id) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRIES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteInquiryById: ${error}`);
        return [];
    });
}

function addInquiry({ user_id, created_by, branch_id, course_id }) {
    return executeSQLQueryParameterized("INSERT INTO INQUIRIES(user_id,created_by,branch_id,course_id) VALUES(?,?,?,?)", [
        user_id,
        created_by,
        branch_id,
        course_id,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiry: ${error}`);
        });
}

module.exports = { getInquiriesByUserId, deleteInquiryById, addInquiry, getInquiryByInquiryId };
