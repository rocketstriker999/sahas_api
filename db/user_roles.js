const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function deleteUserRoleById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE id=?`, [id]).catch((error) => {
        logger.error(`deleteUserRoleByUserRoleId: ${error}`);
    });
}

function deleteUserRolesByRoleId({ role_id }) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE role_id=?`, [role_id]).catch((error) => {
        logger.error(`deleteUserRoleByRoleId: ${error}`);
    });
}

//freeze
function addUserRole({ user_id, role_id, created_by }) {
    return executeSQLQueryParameterized(`INSERT INTO USER_ROLES(user_id,role_id,created_by) VALUES(?,?,?)`, [user_id, role_id, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addUserRole: ${error}`);
        });
}

//freeze
function getUserRoleById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT USER_ROLES.id,ROLES.id as role_id, ROLES.title,USER_ROLES.created_on,USER_ROLES.created_by,USERS.full_name AS created_by_full_name FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id LEFT JOIN USERS ON USER_ROLES.created_by=USERS.id WHERE ROLES.active=TRUE  AND USER_ROLES.id = ?`,
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getUserRoleById: ${error}`);
        });
}

//freeze
function getUserRolesByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        `SELECT USER_ROLES.id,ROLES.id as role_id, ROLES.title,USER_ROLES.created_on,USER_ROLES.created_by,USERS.full_name AS created_by_full_name FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id LEFT JOIN USERS ON USER_ROLES.created_by=USERS.id WHERE ROLES.active=TRUE AND  USER_ROLES.user_id = ?`,
        [user_id]
    ).catch((error) => {
        logger.error(`getUserRolesByUserId: ${error}`);
        return [];
    });
}

module.exports = { getUserRolesByUserId, deleteUserRoleById, addUserRole, getUserRoleById, deleteUserRolesByRoleId };
