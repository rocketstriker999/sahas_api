const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [roleAuthorityId]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

function getRoleAuthoritiesByRoleId(roleId) {
    return executeSQLQueryParameterized(
        "SELECT ROLE_AUTHORITIES.*,AUTHORITIES.title FROM ROLE_AUTHORITIES LEFT JOIN AUTHORITIES ON ROLE_AUTHORITIES.authority_id=AUTHORITIES.id WHERE role_id=? ",
        [roleId]
    ).catch((error) => {
        logger.error(`getRoleAuthoritiesByRoleId: ${error}`);
    });
}

function addRoleAuthority(roleId, authorityId) {
    return executeSQLQueryParameterized("INSERT INTO ROLE_AUHTORITIES (role_id,authority_id) VALUES(?,?)", [roleId, authorityId]).catch((error) => {
        logger.error(`addRoleAuthority: ${error}`);
    });
}

module.exports = { deleteRoleAuthorityByRoleAuthorityId, getRoleAuthoritiesByRoleId, addRoleAuthority };
