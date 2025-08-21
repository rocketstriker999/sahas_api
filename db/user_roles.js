const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteUserRoleByUserRoleId(userRoleId) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE id=?`, [userRoleId]).catch((error) => {
        logger.error(`deleteUserRoleByUserRoleId: ${error}`);
    });
}

function addUserRoleByUserIdAndRoleId({ user_id, role_id, created_by }) {
    return executeSQLQueryParameterized(`INSERT INTO USER_ROLES(user_id,role_id,created_by)`, [user_id, role_id, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addUserRoleByUserIdAndRoleId: ${error}`);
        });
}

function getUserRolesByUserRoleId(userRoleId) {
    return executeSQLQueryParameterized(
        `SELECT USER_ROLES.id,ROLES.id as role_id, ROLES.title,ROLES.created_on,USER_ROLES.created_by,USERS.full_name AS created_by_full_name FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id LEFT JOIN USERS ON USER_ROLES.created_by=USERS.id WHERE ROLES.active=TRUE AND USER_ROLES.active=TRUE AND USER_ROLES.id = ?`,
        [userRoleId]
    ).catch((error) => {
        logger.error(`getUserRolesByUserRoleId: ${error}`);
        return [];
    });
}

module.exports = { deleteUserRoleByUserRoleId, addUserRoleByUserIdAndRoleId, getUserRolesByUserRoleId };
