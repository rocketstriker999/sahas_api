const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    //if we know user
    //if for this user no device mapping is done then do it from here

    if (req.cookies.token && (user = await getUserByToken(req.cookies.token))) {
        logger.success(`Token Verfied - USER-ID : ${user.id}`);
        req.user = user;
    }
    next();
};
