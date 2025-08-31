const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllAuthorities() {
    return executeSQLQueryParameterized("SELECT * FROM AUTHORITIES ORDER BY id DESC").catch((error) => {
        logger.error(`getAllAuthorities: ${error}`);
        return [];
    });
}

//freeze
function getAuthorityById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM AUTHORITIES WHERE id=?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getAuthorityById: ${error}`);
        });
}

//freeze
function deleteAuthorityById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM AUTHORITIES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteAuthorityById: ${error}`);
    });
}

//freeze
function addAuthority({ title, description }) {
    return executeSQLQueryParameterized("INSERT INTO AUTHORITIES(title,description) VALUES(?,?)", [title, description])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addAuthority: ${error}`));
}

module.exports = { getAllAuthorities, deleteAuthorityById, addAuthority, getAuthorityById };
