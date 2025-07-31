const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getRoles() {
    return executeSQLQueryParameterized("SELECT * FROM ROLES").catch((error) => {
        logger.error(`getRoles: ${error}`);
        return false;
    });
}

module.exports = { getRoles };
