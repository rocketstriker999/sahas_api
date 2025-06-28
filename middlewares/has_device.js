const { isDeviceKnown } = require("../db/devices");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    logger.info("headers" + JSON.stringify(req.headers));
    logger.info("device_finger_print" + req.headers?.device_finger_print);

    logger.info(await isDeviceKnown(req.headers?.device_finger_print));

    if (req.headers?.device_finger_print && (isDeviceKnown = await isDeviceKnown(req.headers?.device_finger_print))) {
        return next();
    }

    logger.error("Request Denied - Missing Device FingerPrint");
    return res.status(401).json({ error: "Missing Device FingerPrint" });
};
