const { getUserByToken } = require("../db/users");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    if (req.cookies.token && (user = await getUserByToken(req.cookies.token))) {
        return next();
    }
    logger.error("Request Denied - Missing Authentication");
    return res.status(400).json({ error: "Missing Authentication" });
};
