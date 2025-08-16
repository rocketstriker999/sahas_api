const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentsByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT id,user_id,DATE(start_date),DATE(end_date),total,active,created_on,updated_at FROM USER_ENROLLMENTS WHERE user_id=? ORDER BY id DESC",
        [userId]
    ).catch((error) => {
        logger.error(`getEnrollmentsByUserId: ${error}`);
        return [];
    });
}

module.exports = { getEnrollmentsByUserId };
