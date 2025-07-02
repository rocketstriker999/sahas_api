const { getUserByToken } = require("../../db/users");
const logger = require("../../libs/logger");

module.exports = async (req, res, next) => {
    if (req.cookies.token && (user = await getUserByToken(req.cookies.token))) {
        req.user = user;
        logger.success(`Token Verfied - USER-ID : ${user.id}`);
    }
    next();
};
