const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    logger.info(JSON.stringify(req.headers));

    if (req.headers["Device-ID"]) {
        return next();
    }

    logger.error("Request Denied - Missing Device ID");
    return res.status(400).json({ error: "Missing Device ID" });
};
