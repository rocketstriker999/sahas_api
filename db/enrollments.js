const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getEnrollmentsByUserId(userId) {
    return executeSQLQueryParameterized(
        "SELECT USER_ENROLLMENTS.*,USERS.full_name AS created_by_full_name FROM USER_ENROLLMENTS LEFT JOIN USERS ON USER_ENROLLMENTS.created_by=USERS.id WHERE user_id=? ORDER BY id DESC",
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
        .then((results) => (results.length > 0 ? results[0] : null))
        .catch((error) => logger.error(`getEnrollmentByEnrollmentId: ${error}`));
}

function addEnrollment({ user_id, start_date, end_date, fees, created_by }) {
    return executeSQLQueryParameterized("INSERT INTO USER_ENROLLMENTS(user_id,start_date,end_date,fees,created_by) VALUES(?,?,?,?,?)", [
        user_id,
        start_date,
        end_date,
        fees,
        created_by,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiry: ${error}`);
            return false;
        });
}

module.exports = { getEnrollmentsByUserId, updateEnrollmentByEnrollmentId, getEnrollmentByEnrollmentId, addEnrollment };
