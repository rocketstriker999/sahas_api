const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getInquiryNotesByInquiryId(inquiryId) {
    return executeSQLQueryParameterized("SELECT * FROM INQUIRY_NOTES WHERE inquiry_id=?", [inquiryId]).catch((error) => {
        logger.error(`getInquiryNotesByInquiryId: ${error}`);
        return [];
    });
}

module.exports = { getInquiryNotesByInquiryId };
