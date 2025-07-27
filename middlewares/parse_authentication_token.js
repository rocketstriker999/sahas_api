const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const { getUserByToken, getUserByAuthenticationToken, getUserRolesByUserId } = require("../db/users");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    //verify token and get user information

    if (req.headers?.[KEY_AUTHENTICATION_TOKEN] && (user = await getUserByAuthenticationToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))) {
        req.user = { ...user, roles: await getUserRolesByUserId(authenticationToken.user_id) };
    }
    next();
};
