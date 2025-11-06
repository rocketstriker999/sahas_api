const { logger } = require("sahas_utils");

module.exports = async (req, res, next) => {
    if (req.user) {
        return next();
    }
    logger.error("Request Denied - Missing Authentication");
    return res.status(401).json({ error: "Missing Authentication" });
};
