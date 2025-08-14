const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiryNotesByInquiryId(inquiryId) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRY_NOTES.*,USERS.full_name AS created_by_full_name FROM INQUIRY_NOTES LEFT JOIN USERS ON INQUIRY_NOTES.created_by = USERS.id WHERE inquiry_id=? order by INQUIRY_NOTES.id DESC",
        [inquiryId]
    ).catch((error) => {
        logger.error(`getInquiryNotesByInquiryId: ${error}`);
        return [];
    });
}

module.exports = { getInquiryNotesByInquiryId };
