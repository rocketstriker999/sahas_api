const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllAuthorities() {
    return executeSQLQueryParameterized("SELECT * FROM AUTHORITIES ORDER BY id DESC").catch((error) => {
        logger.error(`getAllAuthorities: ${error}`);
        return [];
    });
}

function getAuthorityById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM AUTHORITIES WHERE id=?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getAuthorityById: ${error}`);
        });
}

function deleteAuthorityByAuthorityId(authorityId) {
    return executeSQLQueryParameterized("DELETE FROM AUTHORITIES WHERE id=?", [authorityId]).catch((error) => {
        logger.error(`deleteAuthorityByAuthorityId: ${error}`);
    });
}

function addAuthority({ title, description }) {
    return executeSQLQueryParameterized("INSERT INTO AUTHORITIES(title,description) VALUES(?,?)", [title, description])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addAuthority: ${error}`));
}

module.exports = { getAllAuthorities, deleteAuthorityByAuthorityId, addAuthority, getAuthorityById };
