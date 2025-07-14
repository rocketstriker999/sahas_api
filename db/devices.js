const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function addActiveUserDevice(userId, fingerPrint) {
    return executeSQLQueryParameterized(`INSERT INTO  USER_DEVICES(user_id,finger_print,active)  VALUES (?,?,TRUE)`, [userId, fingerPrint]).catch((error) => {
        logger.error(`addActiveUserDevice: ${error}`);
        return false;
    });
}

function userDeviceExist(userId, fingerPrint) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USER_DEVICES WHERE user_id = ? AND finger_print=? `, [userId, fingerPrint])
        .then(([result]) => result.count > 0)
        .catch((error) => {
            logger.error(`userDeviceExist: ${error}`);
            return false;
        });
}

function getActiveDevicesByUserId(userId) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_DEVICES WHERE user_id=? AND active=TRUE`, [userId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`extractMediaBySubjectIdAndMediaId: ${error}`));
}

function addInActiveUserDevice(userId, fingerPrint) {
    return executeSQLQueryParameterized(`INSERT  INTO USER_DEVICES(user_id,finger_print,active)  VALUES (?,?,FALSE)`, [userId, fingerPrint]).catch((error) => {
        logger.error(`addInActiveUserDeviceMapping: ${error}`);
        return false;
    });
}

module.exports = {
    addActiveUserDevice,
    userDeviceExist,
    addInActiveUserDevice,
    getActiveDevicesByUserId,
};
