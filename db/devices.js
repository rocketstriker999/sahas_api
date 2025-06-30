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

function isDeviceAssignedToThisUser(deviceId, userId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM MAPPING_USER_DEVICES WHERE device_id = ? AND user_id=? AND active=TRUE`, [
        deviceId,
        userId,
    ])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`isDeviceAllowedForUser: ${error}`);
            return false;
        });
}

function addActiveUserDeviceMapping(user_id, device_id) {
    return executeSQLQueryParameterized(`INSERT INTO MAPPING_USER_DEVICES(user_id,device_id,active)  VALUES (?,?,TRUE)`, [user_id, device_id]).catch(
        (error) => {
            logger.error(`addDeviceUser: ${error}`);
            return false;
        }
    );
}

function hasUserAnyActiveDeviceMapping(user_id) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM MAPPING_USER_DEVICES WHERE user_id = ? AND active=TRUE`, [user_id])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`hasUserAnyActiveDeviceMapping: ${error}`);
            return false;
        });
}

function userDeviceMappingExist(userId, deviceId) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM MAPPING_USER_DEVICES WHERE user_id = ? AND device_id=? AND active=FALSE`, [user_id])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`hasUserAnyActiveDeviceMapping: ${error}`);
            return false;
        });
}

function addInActiveUserDeviceMapping(user_id, device_id) {
    return executeSQLQueryParameterized(`INSERT INTO MAPPING_USER_DEVICES(user_id,device_id,active)  VALUES (?,?,FALSE)`, [user_id, device_id]).catch(
        (error) => {
            logger.error(`addDeviceUser: ${error}`);
            return false;
        }
    );
}

module.exports = {
    getDeviceByFingerPrint,
    addDevice,
    isDeviceAssignedToThisUser,
    hasUserAnyActiveDeviceMapping,
    addActiveUserDeviceMapping,
    userDeviceMappingExist,
    addInActiveUserDeviceMapping,
};
