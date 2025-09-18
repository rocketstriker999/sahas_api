const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getEnrollmentsByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        "SELECT ENROLLMENTS.*,USERS.full_name AS created_by_full_name FROM ENROLLMENTS LEFT JOIN USERS ON ENROLLMENTS.created_by=USERS.id WHERE ENROLLMENTS.user_id=? ORDER BY id DESC",
        [user_id]
    ).catch((error) => {
        logger.error(`getEnrollmentsByUserId: ${error}`);
        return [];
    });
}

//freeze
function updateEnrollmentById({ id, start_date, end_date, on_site_access, digital_access }) {
    return executeSQLQueryParameterized("UPDATE ENROLLMENTS SET start_date=?,end_date=?,on_site_access=?,digital_access=? WHERE id=?", [
        start_date,
        end_date,
        on_site_access,
        digital_access,
        id,
    ]).catch((error) => logger.error(`updateEnrollmentById: ${error}`));
}

//freeze
function getEnrollmentById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT ENROLLMENTS.*,USERS.full_name AS created_by_full_name FROM ENROLLMENTS LEFT JOIN USERS ON ENROLLMENTS.created_by=USERS.id WHERE ENROLLMENTS.id=?",
        [id]
    )
        .then((results) => (results.length > 0 ? results[0] : null))
        .catch((error) => logger.error(`getEnrollmentById: ${error}`));
}

//freeze
function addEnrollment({ user_id, start_date, end_date, fees, on_site_access, digital_access, created_by }) {
    return executeSQLQueryParameterized(
        "INSERT INTO ENROLLMENTS(user_id,start_date,end_date,fees,on_site_access,digital_access,created_by) VALUES(?,?,?,?,?,?,?)",
        [user_id, start_date, end_date, fees, on_site_access, digital_access, created_by]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addEnrollment: ${error}`));
}

module.exports = { getEnrollmentsByUserId, updateEnrollmentById, getEnrollmentById, addEnrollment };
