const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiriesByUserId(userId) {
    return executeSQLQueryParameterized("SELECT * FROM USER_INQUIRIES WHERE user_id=?", [userId]).catch((error) => {
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
