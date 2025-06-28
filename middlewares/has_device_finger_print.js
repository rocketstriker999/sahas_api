const { isDeviceKnown } = require("../db/devices");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    logger.info("fingerpirnt " + req.headers?.["device-finger-print"]);

    if (req.headers?.["device-finger-print"] && (isDeviceKnown = await isDeviceKnown(req.headers?.["device-finger-print"]))) {
        return next();
    }

    logger.error("Request Denied - Missing Device FingerPrint");
    return res.status(401).json({ error: "Missing Device FingerPrint" });
};
