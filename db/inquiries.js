const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

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

function updateInquiryById({ id, active, branch_id, course_id }) {
    return executeSQLQueryParameterized("UPDATE INQUIRIES SET active=?,branch_id=?,course_id=? where id=?", [active, branch_id, course_id, id]).catch(
        (error) => {
            logger.error(`updateInquiryById: ${error}`);
        }
    );
}

function getInquiriesByUserId({ userId }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*, USERS.full_name AS created_by_full_name, COUNT(INQUIRY_NOTES.id) AS notes_count FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by = USERS.id LEFT JOIN INQUIRY_NOTES ON INQUIRY_NOTES.inquiry_id = INQUIRIES.id WHERE INQUIRIES.user_id = ? GROUP BY INQUIRIES.id ORDER BY INQUIRIES.id DESC",
        [userId]
    ).catch((error) => {
        logger.error(`getInquiriesByUserId: ${error}`);
        return [];
    });
}

function getInquiryById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*, USERS.full_name AS created_by_full_name, COUNT(INQUIRY_NOTES.id) AS notes_count FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by = USERS.id LEFT JOIN INQUIRY_NOTES ON INQUIRY_NOTES.inquiry_id = INQUIRIES.id WHERE INQUIRIES.id = ? GROUP BY INQUIRIES.id ",
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getInquiryById: ${error}`);
            return [];
        });
}

function deleteInquiryById(id) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRIES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteInquiryById: ${error}`);
        return [];
    });
}

module.exports = { getInquiriesByUserId, deleteInquiryById, addInquiry, getInquiryById, updateInquiryById };
