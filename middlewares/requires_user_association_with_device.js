const { getDeviceByFingerPrint, hasDeviceOwner, isDeviceKnown } = require("../db/devices");
const logger = require("../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (!req.device) {
        logger.error("Request Denied - Missing or Invalid Device FingerPrint");
        return res.status(401).json({ error: "Missing or Invalid Device FingerPrint" });
    }

    if (!req.device.isCurrentUserAssociatedWithDevice) {
        logger.error("Request Denied - Device Not Allowed");
        return res.status(401).json({ error: "Device Is Not Allowed For Current User" });
    }

    next();
};
