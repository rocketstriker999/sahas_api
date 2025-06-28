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
    return executeSQLQueryParameterized(`INSERT INTO DEVICES(finger_print,description)  VALUES (?,?)`, [device.finger_print, device.description])
        .then((result) => device.finger_print)
        .catch((error) => {
            logger.error(`addDevice: ${error}`);
            return false;
        });
}

function isDeviceKnown(deviceFingerPrint) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM DEVICES WHERE finger_print = ?`, [deviceFingerPrint])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`isDeviceKnown: ${error}`);
            return false;
        });
}

module.exports = { getDevicesByToken, addDevice, isDeviceKnown };
