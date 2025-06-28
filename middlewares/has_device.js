const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    if (req.headers?.device) {
        return next();
    }

    logger.error("Request Denied - Missing Device Information");
    return res.status(401).json({ error: "Missing Device Information" });
};
