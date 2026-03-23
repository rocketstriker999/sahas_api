const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

// Get all policies
function getAllPolicies() {
    return executeSQLQueryParameterized("SELECT * FROM POLICIES ORDER BY created_at DESC").catch((error) => {
        logger.error(`getAllPolicies: ${error}`);
        return [];
    });
}

// Update policy by ID
function updatePolicyById({ id, title, description }) {
    return executeSQLQueryParameterized("UPDATE POLICIES SET title=?, description=? WHERE id=?", [title, description, id]).catch((error) =>
        logger.error(`updatePolicyById: ${error}`)
    );
}

// Get policy by ID
function getPolicyById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM POLICIES WHERE id = ?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getPolicyById: ${error}`));
}

// Delete policy by ID
function deletePolicyById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM POLICIES WHERE id=?", [id]).catch((error) =>
        logger.error(`deletePolicyById: ${error}`)
    );
}

module.exports = { getAllPolicies, updatePolicyById, getPolicyById, deletePolicyById };
