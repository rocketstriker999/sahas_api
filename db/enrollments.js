const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentsByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT id,user_id,DATE(start_date) as start_date,DATE(end_date) as end_date,total,active,created_on,updated_at FROM USER_ENROLLMENTS WHERE user_id=? ORDER BY id DESC",
        [userId]
    ).catch((error) => {
        logger.error(`getEnrollmentsByUserId: ${error}`);
        return [];
    });
}

function updateEnrollmentByEnrollmentId({ id, active, start_date, end_date }) {
    return executeSQLQueryParameterized("UPDATE USER_ENROLLMENTS SET active=?,start_date=?,end_date=? WHERE id=?", [active, start_date, end_date, id]).catch(
        (error) => {
            logger.error(`updateEnrollmentByEnrollmentId: ${error}`);
            return [];
        }
    );
}

function getEnrollmentByEnrollmentId(enrollmentId) {
    return executeSQLQueryParameterized("SELECT * FROM USER_ENROLLMENTS WHERE id =?", [enrollmentId])
        .then((results) => {
            return results.length > 0 ? results[0] : null;
        })
        .catch((error) => {
            logger.error(`getEnrollmentByEnrollmentId: ${error}`);
            return null;
        });
}

module.exports = { getEnrollmentsByUserId, updateEnrollmentByEnrollmentId, getEnrollmentByEnrollmentId };
