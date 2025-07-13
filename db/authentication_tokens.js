const { readConfig } = require("../libs/config");
const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

async function getTokenByOTP(token, otp) {
    //Check if such token is there
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_TOKENS WHERE token = ? AND otp=? AND active=FALSE`, [token, otp])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`getTokenByOTP: ${error}`);
            return false;
        });
}

async function activateToken(token) {
    //Activate Token
    return executeSQLQueryParameterized(`UPDATE USER_TOKENS SET active = TRUE WHERE token = ?`, [token]).catch((error) => {
        logger.error(`activateTokenByOTP: ${error}`);
        return [];
    });
}

async function addInactiveToken(userId, otp, token, validity) {
    //get allowed validity from configuration

    return executeSQLQueryParameterized(`INSERT INTO USER_TOKENS(user_id,otp,token,validity) VALUES(?,?,?,?)`, [userId, otp, token, validity]).catch(
        (error) => {
            logger.error(`addInactiveToken: ${error}`);
            return [];
        }
    );
}

module.exports = { addInactiveToken, activateToken, getTokenByOTP };
