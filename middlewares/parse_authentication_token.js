const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const { getUserByToken, getUserByAuthenticationToken } = require("../db/users");

module.exports = async (req, res, next) => {
    //verify token and get user information

    logger.info("===== " + req.headers?.[KEY_AUTHENTICATION_TOKEN]);

    if (req.headers?.[KEY_AUTHENTICATION_TOKEN] && (user = await getUserByAuthenticationToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))) {
        req.user = user;
    }
    next();
};
