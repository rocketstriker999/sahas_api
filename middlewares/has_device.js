const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    if (req.headers["device-id"]) {
        return next();
    }

    logger.error("Request Denied - Missing Device ID");
    return res.status(401).json({ error: "Missing Device ID" });
};
