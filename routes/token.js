const libExpress = require("express");
const { getUserByToken, getAuthoritiesById, getGroupsById } = require("../db/users");
const router = libExpress.Router();

router.get("/verify", async (req, res) => {
    //if token is present
    if (req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);
        if (user) {
            res.status(200).json({
                user: { ...user, groups: await getGroupsById(user.id), authorities: await getAuthoritiesById(user.id) },
            });
        } else {
            res.status(401).json({ error: "Invalid Token" });
        }
    } else {
        res.status(401).json({ error: "Invalid Token" });
    }
});

module.exports = router;
