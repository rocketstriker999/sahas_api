const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const { getUserByToken } = require("../db/users");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    //verify token and get user information
    if (req.headers?.[KEY_AUTHENTICATION_TOKEN] && (user = await getUserByToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))) {
        req.user = user;
    }
    next();
};
