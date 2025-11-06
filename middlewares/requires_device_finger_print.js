const { KEY_DEVICE_FINGER_PRINT, ERROR_DEVICE_MISSING, REQUEST_DENIED } = require("../constants");
const { logger } = require("sahas_utils");

const { getDeviceDescriptionByFingerPrint } = require("../utils");

module.exports = async (req, res, next) => {
    //Device information is Required
    if (req.headers?.[KEY_DEVICE_FINGER_PRINT]) {
        req.device = {
            fingerPrint: req.headers?.[KEY_DEVICE_FINGER_PRINT],
            description: getDeviceDescriptionByFingerPrint(req.headers?.[KEY_DEVICE_FINGER_PRINT]),
        };

        return next();
    }

    logger.error(`${REQUEST_DENIED} - ${ERROR_DEVICE_MISSING}`);
    return res.status(400).json({ error: ERROR_DEVICE_MISSING });
};
