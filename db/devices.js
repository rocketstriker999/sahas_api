const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getDeviceByFingerPrint(deviceFingerPrint) {
    return executeSQLQueryParameterized(`SELECT * FROM DEVICES WHERE finger_print=?`, [deviceFingerPrint])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
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

function isDeviceAllowedForUser(deviceId, userId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM MAPPING_USER_DEVICES WHERE device_id = ? AND user_id=?`, [deviceId, userId])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`isDeviceAllowedForUser: ${error}`);
            return false;
        });
}

module.exports = { getDeviceByFingerPrint, addDevice, isDeviceKnown, isDeviceAllowedForUser };
