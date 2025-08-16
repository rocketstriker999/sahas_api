const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentsByUserId(userId) {
    return executeSQLQueryParameterized("SELECT * FROM USER_ENROLLMENTS WHERE user_id=? ORDER BY id DESC", [userId]).catch((error) => {
        logger.error(`getEnrollmentsByUserId: ${error}`);
        return [];
    });
}

module.exports = { getEnrollmentsByUserId };
