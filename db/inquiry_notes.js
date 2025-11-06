const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getInquiryNotesByInquiryId({ inquiry_id }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRY_NOTES.*,USERS.full_name AS created_by_full_name FROM INQUIRY_NOTES LEFT JOIN USERS ON INQUIRY_NOTES.created_by = USERS.id WHERE inquiry_id=? order by INQUIRY_NOTES.id DESC",
        [inquiry_id]
    ).catch((error) => {
        logger.error(`getInquiryNotesByInquiryId: ${error}`);
        return [];
    });
}

//freeze
function getInquiryNoteById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRY_NOTES.*,USERS.full_name AS created_by_full_name FROM INQUIRY_NOTES LEFT JOIN USERS ON INQUIRY_NOTES.created_by = USERS.id WHERE INQUIRY_NOTES.id=? ",
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getInquiryNoteById: ${error}`));
}

//freeze
function deleteInquiryNoteById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM INQUIRY_NOTES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteInquiryNoteById: ${error}`);
    });
}

//freeze
function deleteInquiryNotesByInquiryId({ inquiry_id }) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRY_NOTES WHERE inquiry_id=?", [inquiry_id]).catch((error) => {
        logger.error(`deleteInquiryNotesByInquiryId: ${error}`);
    });
}

//freeze
function addInquiryNote({ inquiry_id, note, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO INQUIRY_NOTES(inquiry_id,note,created_by) VALUES(?,?,?)", [inquiry_id, note, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiryNote: ${error}`);
        });
}

module.exports = { getInquiryNotesByInquiryId, getInquiryNoteById, deleteInquiryNoteById, deleteInquiryNotesByInquiryId, addInquiryNote };
