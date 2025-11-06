const { logger } = require("sahas_utils");

module.exports = async (req, res, next) => {
    logger.info(
        `Incoming Request - ${req.method} ${req.url} | USER_EMAIL : ${req?.user?.email} | Device : ${req?.device?.description} | Device Active : ${req.device.active}`
    );

    next();
};
