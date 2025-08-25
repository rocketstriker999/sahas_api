const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function deleteRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [roleAuthorityId]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

function getRoleAuthoritiesByRoleId(roleId) {
    return executeSQLQueryParameterized(
        "SELECT AUTHORITIES.*, ROLE_AUTHORITIES.id AS roleAuthorityId, ROLE_AUTHORITIES.created_on, ROLE_AUTHORITIES.created_by, USERS.id AS user_id, USERS.full_name FROM AUTHORITIES LEFT JOIN ROLE_AUTHORITIES ON AUTHORITIES.id = ROLE_AUTHORITIES.authority_id AND ROLE_AUTHORITIES.role_id = ? LEFT JOIN USERS ON ROLE_AUTHORITIES.created_by = USERS.id",
        [roleId]
    ).catch((error) => {
        logger.error(`getRoleAuthoritiesByRoleId: ${error}`);
    });
}

function addRoleAuthority({ role_id, authority_id, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO ROLE_AUTHORITIES (role_id,authority_id,created_by) VALUES(?,?,?)", [
        role_id,
        authority_id,
        created_by,
    ]).catch((error) => {
        logger.error(`addRoleAuthority: ${error}`);
    });
}

function getRoleAuthorityByRoleAuthorityId(roleAuthorityId) {
    return executeSQLQueryParameterized(
        "SELECT AUTHORITIES.*, ROLE_AUTHORITIES.id AS roleAuthorityId, ROLE_AUTHORITIES.created_on, ROLE_AUTHORITIES.created_by, USERS.id AS user_id, USERS.full_name FROM AUTHORITIES LEFT JOIN ROLE_AUTHORITIES ON AUTHORITIES.id = ROLE_AUTHORITIES.authority_id  LEFT JOIN USERS ON ROLE_AUTHORITIES.created_by = USERS.id where ROLE_AUTHORITIES.id=?",
        [roleAuthorityId]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getRoleAuthorityByRoleAuthorityId: ${error}`);
        });
}

module.exports = { deleteRoleAuthorityByRoleAuthorityId, getRoleAuthoritiesByRoleId, addRoleAuthority, getRoleAuthorityByRoleAuthorityId };
