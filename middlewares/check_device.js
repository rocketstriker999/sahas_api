const { KEY_DEVICE_FINGER_PRINT, ERROR_DEVICE_MISSING, KEY_DEVICE_DESCRIPTION, REQUEST_DENIED } = require("../constants");
const { getDeviceByFingerPrint, addDevice } = require("../db/devices");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    //Device information is Required
    if (req.headers?.[KEY_DEVICE_FINGER_PRINT] && req.headers?.[KEY_DEVICE_DESCRIPTION]) {
        //Insert If Does Not Exist
        await addDevice(req.headers?.[KEY_DEVICE_FINGER_PRINT], req.headers?.[KEY_DEVICE_DESCRIPTION]);
        req.device = await getDeviceByFingerPrint(req.headers?.[KEY_DEVICE_FINGER_PRINT]);
        return next();
    }

    logger.error(`${REQUEST_DENIED} - ${ERROR_DEVICE_MISSING}`);
    return res.status(400).json({ error: ERROR_DEVICE_MISSING });
};
