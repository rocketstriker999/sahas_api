const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getAllBatches() {
    return executeSQLQueryParameterized(
        `SELECT BATCHES.*, BRANCHES.title AS branch_title
         FROM BATCHES
         LEFT JOIN BRANCHES ON BATCHES.branch_id = BRANCHES.id
         ORDER BY BATCHES.id DESC`,
    ).catch((error) => {
        logger.error(`getAllBatches: ${error}`);
        return [];
    });
}

function getBatchById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT BATCHES.*, BRANCHES.title AS branch_title
         FROM BATCHES
         LEFT JOIN BRANCHES ON BATCHES.branch_id = BRANCHES.id
         WHERE BATCHES.id = ?`,
        [id],
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBatchById: ${error}`);
            return false;
        });
}

function addBatch({ title, description = null, branch_id = null, start_date = null, end_date = null, active = true, created_by = null }) {
    return executeSQLQueryParameterized(
        `INSERT INTO BATCHES (title, description, branch_id, start_date, end_date, active, created_by) VALUES (?,?,?,?,?,?,?)`,
        [title, description || null, branch_id || null, start_date || null, end_date || null, active !== false, created_by],
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addBatch: ${error}`));
}

function updateBatchById({ id, title, description = null, branch_id = null, start_date = null, end_date = null, active = true }) {
    return executeSQLQueryParameterized(
        `UPDATE BATCHES SET title=?, description=?, branch_id=?, start_date=?, end_date=?, active=? WHERE id=?`,
        [title, description || null, branch_id || null, start_date || null, end_date || null, !!active, id],
    ).catch((error) => logger.error(`updateBatchById: ${error}`));
}

function deleteBatchById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM BATCH_ATTENDANCE WHERE batch_id=?`, [id])
        .then(() => executeSQLQueryParameterized(`DELETE FROM BATCH_USERS WHERE batch_id=?`, [id]))
        .then(() => executeSQLQueryParameterized(`DELETE FROM BATCHES WHERE id=?`, [id]))
        .catch((error) => logger.error(`deleteBatchById: ${error}`));
}

function getBatchesByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        `SELECT BATCHES.*, BRANCHES.title AS branch_title, BATCH_USERS.created_on AS assigned_on
         FROM BATCH_USERS
         INNER JOIN BATCHES ON BATCHES.id = BATCH_USERS.batch_id
         LEFT JOIN BRANCHES ON BATCHES.branch_id = BRANCHES.id
         WHERE BATCH_USERS.user_id = ?
         ORDER BY BATCHES.id DESC`,
        [user_id],
    ).catch((error) => {
        logger.error(`getBatchesByUserId: ${error}`);
        return [];
    });
}

const BATCH_USER_SELECT = `SELECT BATCH_USERS.id, BATCH_USERS.batch_id, BATCH_USERS.user_id, BATCH_USERS.created_on AS assigned_on,
                USERS.full_name, USERS.email, USERS.phone, USERS.roll_no, USERS.prn_gr, USERS.active
         FROM BATCH_USERS
         INNER JOIN USERS ON USERS.id = BATCH_USERS.user_id`;

function getUsersByBatchId({ batch_id }) {
    return executeSQLQueryParameterized(`${BATCH_USER_SELECT} WHERE BATCH_USERS.batch_id = ? ORDER BY BATCH_USERS.id DESC`, [batch_id]).catch((error) => {
        logger.error(`getUsersByBatchId: ${error}`);
        return [];
    });
}

function getBatchUserById({ id }) {
    return executeSQLQueryParameterized(`${BATCH_USER_SELECT} WHERE BATCH_USERS.id = ?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBatchUserById: ${error}`);
            return false;
        });
}

function getAssignableUsersForBatch({ batch_id, search, limit = 10 }) {
    if (!search) {
        return Promise.resolve([]);
    }

    const like = `%${search}%`;

    return executeSQLQueryParameterized(
        `SELECT USERS.id, USERS.full_name, USERS.email, USERS.phone, USERS.roll_no, USERS.prn_gr, USERS.active
         FROM USERS
         WHERE (
            (USERS.roll_no IS NOT NULL AND USERS.roll_no != '')
            OR (USERS.prn_gr IS NOT NULL AND USERS.prn_gr != '')
         )
         AND USERS.id NOT IN (SELECT user_id FROM BATCH_USERS WHERE batch_id = ?)
         AND (
            USERS.full_name LIKE ?
            OR USERS.email LIKE ?
            OR USERS.phone LIKE ?
            OR USERS.roll_no LIKE ?
            OR USERS.prn_gr LIKE ?
         )
         ORDER BY USERS.id DESC
         LIMIT ?`,
        [batch_id, like, like, like, like, like, Number(limit) || 10],
    ).catch((error) => {
        logger.error(`getAssignableUsersForBatch: ${error}`);
        return [];
    });
}

function isUserAssignable({ user_id }) {
    return executeSQLQueryParameterized(
        `SELECT id FROM USERS
         WHERE id = ?
         AND (
            (roll_no IS NOT NULL AND roll_no != '')
            OR (prn_gr IS NOT NULL AND prn_gr != '')
         )`,
        [user_id],
    )
        .then((result) => result.length > 0)
        .catch((error) => {
            logger.error(`isUserAssignable: ${error}`);
            return false;
        });
}

function isUserInBatch({ batch_id, user_id }) {
    return executeSQLQueryParameterized(`SELECT id FROM BATCH_USERS WHERE batch_id = ? AND user_id = ?`, [batch_id, user_id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`isUserInBatch: ${error}`);
            return false;
        });
}

function addUserToBatch({ batch_id, user_id, created_by = null }) {
    return executeSQLQueryParameterized(`INSERT INTO BATCH_USERS (batch_id, user_id, created_by) VALUES (?,?,?)`, [batch_id, user_id, created_by])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addUserToBatch: ${error}`));
}

function removeUserFromBatch({ batch_id, user_id }) {
    return executeSQLQueryParameterized(`DELETE FROM BATCH_ATTENDANCE WHERE batch_id=? AND user_id=?`, [batch_id, user_id])
        .then(() => executeSQLQueryParameterized(`DELETE FROM BATCH_USERS WHERE batch_id=? AND user_id=?`, [batch_id, user_id]))
        .catch((error) => logger.error(`removeUserFromBatch: ${error}`));
}

module.exports = {
    getAllBatches,
    getBatchById,
    addBatch,
    updateBatchById,
    deleteBatchById,
    getBatchesByUserId,
    getUsersByBatchId,
    getBatchUserById,
    getAssignableUsersForBatch,
    isUserAssignable,
    isUserInBatch,
    addUserToBatch,
    removeUserFromBatch,
};
