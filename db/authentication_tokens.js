const { readConfig } = require("../libs/config");
const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

async function addInactiveToken(userId, otp, token, validity) {
    //get allowed validity from configuration

    return executeSQLQueryParameterized(`INSERT INTO USER_TOKENS(user_id,otp,token,validity) VALUES(?,?,?,?)`, [userId, otp, token, validity]).catch(
        (error) => {
            logger.error(`addInactiveToken: ${error}`);
            return [];
        }
    );
}

module.exports = { addInactiveToken };
