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

function addDevice({ device }) {
    return executeSQLQueryParameterized(`INSERT INTO DEVICES(description)  VALUES (?)`, [device])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`createTransaction: ${error}`);
            return false;
        });
}

module.exports = { getDevicesByToken, addDevice };
