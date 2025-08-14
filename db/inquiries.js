const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiriesByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT USER_INQUIRIES.*,USERS.full_name as created_by_full_name FROM USER_INQUIRIES LEFT JOIN USERS ON USER_INQUIRIES.created_by=USERS.id WHERE USER_INQUIRIES.user_id=?",
        [userId]
    ).catch((error) => {
        logger.error(`getInquiriesByUserId: ${error}`);
        return [];
    });
}

function deleteInquiryById(inquiryId) {
    return executeSQLQueryParameterized("DELETE  FROM USER_INQUIRIES WHERE id=?", [inquiryId]).catch((error) => {
        logger.error(`deleteInquiryById: ${error}`);
        return [];
    });
}

module.exports = { getInquiriesByUserId, deleteInquiryById };
