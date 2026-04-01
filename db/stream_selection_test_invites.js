const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

// Get all stream selection test invites
function getAllStreamSelectionTestInvites() {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TEST_INVITES ORDER BY created_at DESC").catch((error) => {
        logger.error(`getAllStreamSelectionTestInvites: ${error}`);
        return [];
    });
}

// Update stream selection test invite by ID
function updateStreamSelectionTestInviteById({ id, title, active }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_TEST_INVITES SET title=?, active=? WHERE id=?", [title, active, id]).catch((error) =>
        logger.error(`updateStreamSelectionTestInviteById: ${error}`),
    );
}

// Get stream selection test invite by ID
function getStreamSelectionTestInviteById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TEST_INVITES WHERE id = ?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getStreamSelectionTestInviteById: ${error}`);
            return false;
        });
}

function addStreamSelectionTestInvite({ title }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TEST_INVITES(title) VALUES(?) ", [title])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`getStreamSelectionTestInviteById: ${error}`);
            return false;
        });
}

module.exports = { getAllStreamSelectionTestInvites, updateStreamSelectionTestInviteById, getStreamSelectionTestInviteById, addStreamSelectionTestInvite };
