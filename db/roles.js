const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllRoles() {
    return executeSQLQueryParameterized("SELECT * FROM ROLES").catch((error) => {
        logger.error(`getAllRoles: ${error}`);
        return [];
    });
}

module.exports = { getAllRoles };
