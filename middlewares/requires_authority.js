const { logger } = require("sahas_utils");
const { hasRequiredAuthority } = require("../utils");

module.exports = async (requiredAuthority, req, res, next) => {
    if (hasRequiredAuthority(req.user.authorities, requiredAuthority)) {
        next();
    }
    return res.status(403).json({ error: "You Don't have authority to perform this operation" });
};
