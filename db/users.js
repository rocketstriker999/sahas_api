const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function updateUserToken(email, token) {
    return executeSQLQueryParameterized(`UPDATE USERS SET token=? WHERE email=?`, [token, email]).catch((error) => {
        logger.error(`Error While Updating Token: ${error}`);
        return false;
    });
}

function getUserByEmail(email) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE email=?`, [email])
        .then((user) => (user && user.length > 0 ? user[0] : false))
        .catch((error) => {
            logger.error(`Error While Getting User: ${error}`);
            return false;
        });
}

function getUserByToken(token) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE token=?`, [token])
        .then((user) => (user && user.length > 0 ? user[0] : false))
        .catch((error) => {
            logger.error(`Error While Getting User: ${error}`);
            return false;
        });
}

function getGroupsById(id) {
    return executeSQLQueryParameterized("SELECT DISTINCT(title) FROM USER_GROUPS WHERE user_id=?", [id])
        .then((groups) => (groups && groups.length > 0 ? groups.map((row) => row.title) : []))
        .catch((error) => {
            logger.error(`Error While Getting User: ${error}`);
            return false;
        });
}

function getAuthoritiesById(id) {
    return executeSQLQueryParameterized(`SELECT DISTINCT(title) FROM USER_AUTHORITIES WHERE user_id=?`, [id])
        .then((authorities) => (authorities && authorities.length > 0 ? authorities.map((row) => row.title) : []))
        .catch((error) => {
            logger.error(`Error While Getting User: ${error}`);
            return false;
        });
}

function updateUserOTP(email, otp) {
    //if user exist
    executeSQLQueryParameterized(`INSERT INTO USERS (email, otp) VALUES (?, ?)ON DUPLICATE KEY UPDATE otp = VALUES(otp)`, [email, otp]);
}

function validateUserOTP(email, otp) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USERS WHERE email = ? AND otp = ?`, [email, otp])
        .then(([result]) => {
            if (result.count > 0) {
                return true; // OTP is valid
            }
            return false; // OTP is invalid
        })
        .catch((error) => {
            logger.error(`Error validating OTP: ${error}`);
            return false;
        });
}

module.exports = { updateUserOTP, validateUserOTP, updateUserToken, getUserByEmail, getUserByToken, getGroupsById, getAuthoritiesById };
