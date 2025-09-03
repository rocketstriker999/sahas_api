const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function deleteRoleAuthoritiesByAuthorityId({ authority_id }) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE authority_id = ?", [authority_id]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

//freeze
function deleteRoleAuthoritiesByRoleId({ role_id }) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE role_id = ?", [role_id]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleId: ${error}`);
    });
}

//freeze
function deleteRoleAuthorityById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM ROLE_AUTHORITIES WHERE id = ?", [id]).catch((error) => {
        logger.error(`deleteRoleAuthorityByRoleAuthorityId: ${error}`);
    });
}

//freeze
function getRoleAuthoritiesByRoleId({ role_id }) {
    return executeSQLQueryParameterized(
        "SELECT ROLE_AUTHORITIES.id, AUTHORITIES.id AS authority_id,AUTHORITIES.title, ROLE_AUTHORITIES.created_on, ROLE_AUTHORITIES.created_by, USERS.full_name AS created_by_full_name FROM AUTHORITIES LEFT JOIN ROLE_AUTHORITIES ON AUTHORITIES.id = ROLE_AUTHORITIES.authority_id AND ROLE_AUTHORITIES.role_id = ? LEFT JOIN USERS ON ROLE_AUTHORITIES.created_by = USERS.id",
        [role_id]
    ).catch((error) => {
        logger.error(`getRoleAuthoritiesByRoleId: ${error}`);
    });
}

//freeze
function addRoleAuthority({ role_id, authority_id, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO ROLE_AUTHORITIES (role_id,authority_id,created_by) VALUES(?,?,?)", [role_id, authority_id, created_by])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addRoleAuthority: ${error}`));
}

//freeze
function getRoleAuthorityById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT AUTHORITIES.*, ROLE_AUTHORITIES.id AS roleAuthorityId, ROLE_AUTHORITIES.created_on, ROLE_AUTHORITIES.created_by,ROLE_AUTHORITIES.created_on, USERS.id AS user_id, USERS.full_name  AS created_by_full_name FROM AUTHORITIES LEFT JOIN ROLE_AUTHORITIES ON AUTHORITIES.id = ROLE_AUTHORITIES.authority_id  LEFT JOIN USERS ON ROLE_AUTHORITIES.created_by = USERS.id where ROLE_AUTHORITIES.id=?",
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getRoleAuthorityByRoleAuthorityId: ${error}`));
}

module.exports = {
    deleteRoleAuthoritiesByAuthorityId,
    deleteRoleAuthorityById,
    getRoleAuthoritiesByRoleId,
    addRoleAuthority,
    getRoleAuthorityById,
    deleteRoleAuthoritiesByRoleId,
};
