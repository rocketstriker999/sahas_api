const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getDeviceByFingerPrint(deviceFingerPrint) {
    return executeSQLQueryParameterized(`SELECT * FROM DEVICES WHERE finger_print=?`, [deviceFingerPrint])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getDeviceByFingerPrint: ${error}`);
            return [];
        });
}

function addDevice(deviceFingerPrint, deviceDescription) {
    return executeSQLQueryParameterized(`INSERT IGNORE INTO DEVICES(finger_print,description)  VALUES (?,?)`, [deviceFingerPrint, deviceDescription]).catch(
        (error) => {
            logger.error(`addDevice: ${error}`);
            return false;
        }
    );
}

function isDeviceAssignedToThisUser(deviceId, userId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_DEVICES WHERE device_id = ? AND user_id=? AND active=TRUE`, [deviceId, userId])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`isDeviceAssignedToThisUser: ${error}`);
            return false;
        });
}

function addActiveUserDeviceMapping(userId, deviceId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_DEVICES(user_id,device_id,active)  VALUES (?,?,TRUE)`, [userId, deviceId]).catch((error) => {
        logger.error(`addActiveUserDeviceMapping: ${error}`);
        return false;
    });
}

function hasUserAnyDeviceMapping(userId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_DEVICES WHERE user_id = ?`, [userId])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`hasUserAnyActiveDeviceMapping: ${error}`);
            return false;
        });
}

function hasUserAnyActiveDeviceMapping(userId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_DEVICES WHERE user_id = ? AND active=TRUE`, [userId])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`hasUserAnyActiveDeviceMapping: ${error}`);
            return false;
        });
}

function userDeviceMappingExist(userId, deviceId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_DEVICES WHERE user_id = ? AND device_id=? `, [userId, deviceId])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`userDeviceMappingExist: ${error}`);
            return false;
        });
}

function addInActiveUserDeviceMapping(userId, deviceId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_DEVICES(user_id,device_id,active)  VALUES (?,?,FALSE)`, [userId, deviceId]).catch((error) => {
        logger.error(`addInActiveUserDeviceMapping: ${error}`);
        return false;
    });
}

module.exports = {
    getDeviceByFingerPrint,
    addDevice,
    isDeviceAssignedToThisUser,
    hasUserAnyDeviceMapping,
    hasUserAnyActiveDeviceMapping,
    addActiveUserDeviceMapping,
    userDeviceMappingExist,
    addInActiveUserDeviceMapping,
};
