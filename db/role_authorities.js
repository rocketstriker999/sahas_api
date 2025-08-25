const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [roleAuthorityId]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

function getRoleAuthoritiesByRoleId(roleId) {
    return executeSQLQueryParameterized(
        "SELECT ROLE_AUTHORITIES.*,AUTHORITIES.title,USERS.full_name AS created_by_full_name FROM ROLE_AUTHORITIES LEFT JOIN AUTHORITIES ON ROLE_AUTHORITIES.authority_id=AUTHORITIES.id LEFT JOIN USERS ON ROLE_AUTHORITIES.created_by=USERS.id WHERE role_id=? ",
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
