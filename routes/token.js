const libExpress = require("express");

const router = libExpress.Router();

router.get("/verify", (req, res) => {
    const authToken = req.cookies.auth_token; // Get the cookie

    if (authToken) {
        res.cookie("auth_token", "1234", { httpOnly: true, maxAge: 3600000 });

        res.status(200).json({
            groups: ["USER"],
        });
    } else {
        res.status(401).json({ error: "Invalid Token" });
    }
});

router.post("/create", (req, res) => {
    res.cookie("auth_token", "1234", { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({
        user: {
            groups: ["USER"],
        },
    });
});

module.exports = router;
