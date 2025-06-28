const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getDevicesByToken(token) {
    return executeSQLQueryParameterized(`SELECT USERS.id,DEVICES.* FROM USERS INNER JOIN DEVICES ON USERS.id=DEVICES.user_id WHERE USERS.token=?`, [
        token,
    ]).catch((error) => {
        logger.error(`executeSQLQueryParameterized: ${error}`);
        return [];
    });
}

function addDevice(device) {
    return executeSQLQueryParameterized(`INSERT INTO DEVICES  VALUES (?,?)`, [device.id, device.description])
        .then((result) => device.id)
        .catch((error) => {
            logger.error(`addDevice: ${error}`);
            return false;
        });
}

module.exports = { getDevicesByToken, addDevice };
