const { hasRequiredAuthority } = require("../utils");

module.exports = (requiredAuthority) => (req, res, next) => {
    if (hasRequiredAuthority(req?.user?.authorities, requiredAuthority)) {
        return next();
    }
    return res.status(403).json({ error: "You Don't have authority to perform this operation" });
};
