const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getAllBranches() {
    return executeSQLQueryParameterized(`SELECT * FROM BRANCHES ORDER BY id`).catch((error) => {
        logger.error(`getAllBranches: ${error}`);
        return [];
    });
}

function getBranchById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM BRANCHES WHERE id=?`, [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getBranchById: ${error}`);
        });
}

module.exports = { getAllBranches, getBranchById };
