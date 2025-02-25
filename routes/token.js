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

router.post("/invalidate", async (req, res) => {
    await res.clearCookie("token", {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "None", // Required for cross-origin requests
        domain: process.env.CURRENT_DOMAIN,
    });
    return res.status(200).json({
        message: "Token Invalidated",
    });
});

module.exports = router;
