const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [roleAuthorityId]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

function getRoleAuthoritiesByRoleId(roleId) {
    return executeSQLQueryParameterized(
        "SELECT AUTHORITIES.*, ROLE_AUTHORITIES.id as roleAuthorityId FROM AUTHORITIES LEFT JOIN ROLE_AUTHORITIES ON AUTHORITIES.id = ROLE_AUTHORITIES.authority_id AND ROLE_AUTHORITIES.role_id = ?",
        [roleId]
    ).catch((error) => {
        logger.error(`getRoleAuthoritiesByRoleId: ${error}`);
    });
}

function addRoleAuthority({ role_id, authority_id, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO ROLE_AUHTORITIES (role_id,authority_id,created_by) VALUES(?,?,?)", [
        role_id,
        authority_id,
        created_by,
    ]).catch((error) => {
        logger.error(`addRoleAuthority: ${error}`);
    });
}

module.exports = { deleteRoleAuthorityByRoleAuthorityId, getRoleAuthoritiesByRoleId, addRoleAuthority };
