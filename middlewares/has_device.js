const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    logger.info(JSON.stringify(req.user));

    if (req.headers["device-id"]) {
        return next();
    }

    logger.error("Request Denied - Missing Device ID");
    return res.status(401).json({ error: "Missing Device ID" });
};
