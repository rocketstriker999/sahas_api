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

function addRole({ title }) {
    return executeSQLQueryParameterized("INSERT INTO ROLES(title) VALUES(?)", [title])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addRole: ${error}`));
}

function getRoleByRoleId(roleId) {
    return executeSQLQueryParameterized("SELECT * FROM ROLES WHERE id=?", [roleId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getRoleByRoleId: ${error}`);
        });
}

module.exports = { getAllRoles, deleteRoleByRoleId, addRole, getRoleByRoleId };
