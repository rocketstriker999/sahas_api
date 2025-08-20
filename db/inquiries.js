const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiriesByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT USER_INQUIRIES.*,USERS.full_name AS created_by_full_name FROM USER_INQUIRIES LEFT JOIN USERS ON USER_INQUIRIES.created_by=USERS.id WHERE USER_INQUIRIES.user_id=? ORDER BY USER_INQUIRIES.id DESC",
        [userId]
    ).catch((error) => {
        logger.error(`getInquiriesByUserId: ${error}`);
        return [];
    });
}

function getInquiryByInquiryId(inquiryId) {
    return executeSQLQueryParameterized(
        "SELECT USER_INQUIRIES.*,USERS.full_name AS created_by_full_name FROM USER_INQUIRIES LEFT JOIN USERS ON USER_INQUIRIES.created_by=USERS.id WHERE USER_INQUIRIES.id=? ",
        [inquiryId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getInquiryByInquiryId: ${error}`);
            return [];
        });
}

function deleteInquiryById(inquiryId) {
    return executeSQLQueryParameterized("DELETE  FROM USER_INQUIRIES WHERE id=?", [inquiryId]).catch((error) => {
        logger.error(`deleteInquiryById: ${error}`);
        return [];
    });
}

function addInquiry({ user_id, created_by, branch_id, course_id }) {
    return executeSQLQueryParameterized("INSERT INTO USER_INQUIRIES(user_id,created_by,branch_id,course_id) VALUES(?,?,?,?)", [
        user_id,
        created_by,
        branch_id,
        course_id,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiry: ${error}`);
            return false;
        });
}

module.exports = { getInquiriesByUserId, deleteInquiryById, addInquiry, getInquiryByInquiryId };
