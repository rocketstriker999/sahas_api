const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteUserRoleById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE id=?`, [id]).catch((error) => {
        logger.error(`deleteUserRoleByUserRoleId: ${error}`);
    });
}

function deleteUserRoleByRoleId(roleId) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE role_id=?`, [roleId]).catch((error) => {
        logger.error(`deleteUserRoleByRoleId: ${error}`);
    });
}

function addUserRoleByUserIdAndRoleId({ user_id, role_id, created_by }) {
    return executeSQLQueryParameterized(`INSERT INTO USER_ROLES(user_id,role_id,created_by) VALUES(?,?,?)`, [user_id, role_id, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addUserRoleByUserIdAndRoleId: ${error}`);
        });
}

function getUserRoleByUserRoleId(userRoleId) {
    return executeSQLQueryParameterized(
        `SELECT USER_ROLES.id,ROLES.id as role_id, ROLES.title,USER_ROLES.created_on,USER_ROLES.created_by,USERS.full_name AS created_by_full_name FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id LEFT JOIN USERS ON USER_ROLES.created_by=USERS.id WHERE ROLES.active=TRUE  AND USER_ROLES.id = ?`,
        [userRoleId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getUserRoleByUserRoleId: ${error}`);
        });
}

function getUserRolesByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        `SELECT USER_ROLES.id,ROLES.id as role_id, ROLES.title,USER_ROLES.created_on,USER_ROLES.created_by,USERS.full_name AS created_by_full_name FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id LEFT JOIN USERS ON USER_ROLES.created_by=USERS.id WHERE ROLES.active=TRUE AND  USER_ROLES.user_id = ?`,
        [user_id]
    ).catch((error) => {
        logger.error(`getUserRolesByUserId: ${error}`);
        return [];
    });
}

module.exports = { getUserRolesByUserId, deleteUserRoleById, addUserRoleByUserIdAndRoleId, getUserRoleByUserRoleId, deleteUserRoleByRoleId };
