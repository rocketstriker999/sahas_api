const {} = require("../../db/devices");
const logger = require("../../libs/logger");

const REQUEST_DENIED = "REQUEST DENIED";

module.exports = async (req, res, next) => {
    //this need to remove a fter a week
    return next();

    if (!req.device) {
        logger.error(`${REQUEST_DENIED} - Missing or Invalid Device FingerPrint`);
        return res.status(401).json({ error: "Missing or Invalid Device FingerPrint" });
    }

    if (!req.device.isCurrentUserAssociatedWithDevice) {
        logger.error(`${REQUEST_DENIED} - Device Not Allowed`);
        return res.status(401).json({ error: "Device Is Not Allowed For Current User" });
    }

    next();
};
