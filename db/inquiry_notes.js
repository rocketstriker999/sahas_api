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

function getInquiryNoteByInquiryNoteId(inquiryNoteId) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRY_NOTES.*,USERS.full_name AS created_by_full_name FROM INQUIRY_NOTES LEFT JOIN USERS ON INQUIRY_NOTES.created_by = USERS.id WHERE INQUIRY_NOTES.id=? ",
        [inquiryNoteId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getInquiryNoteByInquiryNoteId: ${error}`);
            return [];
        });
}

function deleteInquiryNoteByNoteId(noteId) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRY_NOTES WHERE id=?", [noteId]).catch((error) => {
        logger.error(`deleteInquiryNoteById: ${error}`);
        return [];
    });
}

function deleteInquiryNotesByInquiryId(inquiryId) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRY_NOTES WHERE inquiry_id=?", [inquiryId]).catch((error) => {
        logger.error(`deleteInquiryNotesById: ${error}`);
        return [];
    });
}

function addInquiryNote({ inquiry_id, note, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO INQUIRY_NOTES(inquiry_id,note,created_by) VALUES(?,?,?)", [inquiry_id, note, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiryNote: ${error}`);
            return [];
        });
}

module.exports = { getInquiryNotesByInquiryId, getInquiryNoteByInquiryNoteId, deleteInquiryNoteByNoteId, deleteInquiryNotesByInquiryId, addInquiryNote };
