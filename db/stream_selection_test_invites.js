const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllStreamSelectionTestInvites() {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TEST_INVITES ORDER BY created_at DESC").catch((error) => {
        logger.error(`getAllStreamSelectionTestInvites: ${error}`);
        return [];
    });
}

//freeze
function updateStreamSelectionTestInviteById({ id, title, active }) {
    return executeSQLQueryParameterized("UPDATE STREAM_SELECTION_TEST_INVITES SET title=?, active=? WHERE id=?", [title, active, id]).catch((error) =>
        logger.error(`updateStreamSelectionTestInviteById: ${error}`),
    );
}

//freeze
function getStreamSelectionTestInviteById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM STREAM_SELECTION_TEST_INVITES WHERE id = ?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getStreamSelectionTestInviteById: ${error}`));
}

//freeze
function addStreamSelectionTestInvite({ title, active }) {
    return executeSQLQueryParameterized("INSERT INTO STREAM_SELECTION_TEST_INVITES(title,active) VALUES(?,?) ", [title, active])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`getStreamSelectionTestInviteById: ${error}`);
            return false;
        });
}

//freeze
function deleteStreamSelectionTestInviteById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM STREAM_SELECTION_TEST_INVITES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteStreamSelectionTestInviteById: ${error}`);
    });
}

module.exports = {
    getAllStreamSelectionTestInvites,
    updateStreamSelectionTestInviteById,
    getStreamSelectionTestInviteById,
    addStreamSelectionTestInvite,
    deleteStreamSelectionTestInviteById,
};
