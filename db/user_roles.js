const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteUserRoleByUserRoleId(userRoleId) {
    return executeSQLQueryParameterized(`DELETE FROM USER_ROLES WHERE id=?`, [userRoleId]).catch((error) => {
        logger.error(`deleteUserRoleByUserRoleId: ${error}`);
    });
}

module.exports = { deleteUserRoleByUserRoleId };
