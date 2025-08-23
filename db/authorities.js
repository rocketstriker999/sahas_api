const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllAuthorities() {
    return executeSQLQueryParameterized("SELECT * FROM AUTHORITIES ORDER BY id DESC").catch((error) => {
        logger.error(`getAllAuthorities: ${error}`);
        return [];
    });
}

module.exports = { getAllAuthorities };
