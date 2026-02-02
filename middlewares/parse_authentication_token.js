const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const { getUserRolesByUserId } = require("../db/user_roles");
const { getUserByAuthenticationToken, getAuthoritiesByRoleIds } = require("../db/users");

module.exports = async (req, res, next) => {
    //verify token and get user information

    if (req.headers?.[KEY_AUTHENTICATION_TOKEN] && (user = await getUserByAuthenticationToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))) {
        req.user = user;

        //get roles & authorities of user
        const userRoles = await getUserRolesByUserId({ user_id: user.id });
        const authorities = await getAuthoritiesByRoleIds(userRoles.map(({ role_id }) => role_id).join(","));
        req.user.roles = userRoles?.map(({ title }) => title);
        req.user.authorities = authorities?.map((authority) => authority.title);
    }
    next();
};
