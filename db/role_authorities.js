const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [roleAuthorityId]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

function getRoleAuthoritiesByRoleId(roleId) {
    return executeSQLQueryParameterized("SELECT * FROM ROLE_AUTHORITIES WHERE role_id=? AND active =TRUE", [roleId]).catch((error) => {
        logger.error(`getRoleAuthoritiesByRoleId: ${error}`);
    });
}

module.exports = { deleteRoleAuthorityByRoleAuthorityId, getRoleAuthoritiesByRoleId };
