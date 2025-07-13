const { readConfig } = require("../libs/config");
const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

async function addInactiveToken(userId, token, otp) {
    //get allowed validity from configuration
    const { authentication: { validity } = {} } = await readConfig("app");

    return executeSQLQueryParameterized(`INSERT INTO USER_TOKENS(user_id,otp,token,validity)`, [userId, token, otp, validity * 24 * 60 * 60 * 1000]).catch(
        (error) => {
            logger.error(`addInactiveToken: ${error}`);
            return [];
        }
    );
}

module.exports = { addInactiveToken };
