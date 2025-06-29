const { getDeviceByFingerPrint, isDeviceAllowedForUser } = require("../db/devices");
const logger = require("../libs/logger");

//if user's mamping with device
//if user device's mapping with no user exist inseet allowed
//if already exist the mapping then verify the user's access

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (!req.user) {
        logger.error("Request Denied - Missing Authentication");
        return res.status(401).json({ error: "Missing Authentication" });
    }

    if (!req.headers?.DEVICE_FINGER_PRINT_KEY || !(await isDeviceKnown(req.headers?.DEVICE_FINGER_PRINT_KEY))) {
        logger.error("Request Denied - Missing Device FingerPrint");
        return res.status(401).json({ error: "Missing Device FingerPrint" });
    }

    if (!(device = await getDeviceByFingerPrint(req.headers?.DEVICE_FINGER_PRINT_KEY)) || !isDeviceAllowedForUser(device.id, req.user.id)) {
        logger.error("Request Denied - Device Not Allowed");
        return res.status(401).json({ error: "Device Is Not Allowed" });
    }

    next();
};
