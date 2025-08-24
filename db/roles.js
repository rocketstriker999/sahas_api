const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllRoles() {
    return executeSQLQueryParameterized("SELECT * FROM ROLES").catch((error) => {
        logger.error(`getAllRoles: ${error}`);
        return false;
    });
}

function deleteRoleByRoleId(roleId) {
    return executeSQLQueryParameterized("DELETE FROM ROLES WHERE id=?", [roleId]).catch((error) => {
        logger.error(`deleteRoleByRoleId: ${error}`);
    });
}

module.exports = { getAllRoles, deleteRoleByRoleId };
