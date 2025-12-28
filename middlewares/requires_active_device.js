const { logger } = require("sahas_utils");

module.exports = async (req, res, next) => {
    if (req?.device?.active) {
        console.log(JSON.stringify(req.device));

        return next();
    }
    logger.error("Request Denied - Device Not Allowed For User");
    return res.status(403).json({ error: "Device Not Allowed" });
};
