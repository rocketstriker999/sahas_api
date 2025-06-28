const logger = require("../libs/logger");

export default (req, res, next) => {
    logger.info(`Incoming Request - ${req.method} ${req.url}`);
    next();
};
