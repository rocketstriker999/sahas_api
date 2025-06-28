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

function addDevice(deviceDescription) {
    return executeSQLQueryParameterized(`INSERT INTO DEVICES(description)  VALUES (?)`, [deviceDescription])
        .then((result) => {
            logger.info(result);

            return "123";
        })
        .catch((error) => {
            logger.error(`addDevice: ${error}`);
            return false;
        });
}

module.exports = { getDevicesByToken, addDevice };
