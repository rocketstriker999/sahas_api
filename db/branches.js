const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getAllBranches() {
    return executeSQLQueryParameterized(`SELECT * FROM BRANCHES ORDER BY id`).catch((error) => {
        logger.error(`getAllBranches: ${error}`);
        return [];
    });
}

module.exports = { getAllBranches };
