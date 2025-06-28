const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getDevicesByToken(token) {
    return executeSQLQueryParameterized(
        `SELECT USERS.id,USER_DEVICES.* FROM USERS INNER JOIN USER_DEVICES ON USERS.id=USER_DEVICES.user_id WHERE USERS.token=?`,
        [token]
    ).catch((error) => {
        logger.error(`executeSQLQueryParameterized: ${error}`);
        return [];
    });
}

function addDevice(device) {
    return executeSQLQueryParameterized(`INSERT INTO DEVICES VALUES (?,?,?)`, [device.os, device.company, device.browser])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`createTransaction: ${error}`);
            return false;
        });
}

module.exports = { getDevicesByToken, addDevice };
