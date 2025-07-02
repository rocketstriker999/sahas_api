const logger = require("../../libs/logger");

module.exports = async (req, res, next) => {
    logger.info(`Incoming Request - ${req.method} ${req.url}`);
    next();
};
