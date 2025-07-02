const logger = require("../../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    logger.info(`Incoming Request - ${req.method} ${req.url}`);

    //verify token and get user information
    if (req.cookies.token && (user = await getUserByToken(req.cookies.token))) {
        req.user = user;
    }

    logger.success(`Request Token Verfied - USER-ID : ${user.id} - USER-EMAIL : ${user.email}`);

    next();
};
