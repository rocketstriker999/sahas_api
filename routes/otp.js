const libExpress = require("express");

const router = libExpress.Router();

router.post("/verify", (req, res) => {
    if (req.body.userEmail && req.body.otp) {
        res.cookie("auth_token", "1234", { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({
            auth_token: "1234",
            user: {
                groups: ["USER"],
                name: "User 1",
                phone: "1234",
            },
        });
    } else {
        res.status(401).json({
            error: `Invalid OTP`,
        });
    }
});

router.post("/create", async (req, res) => {
    await setTimeout(() => {
        if (req.body.userEmail) {
            res.status(200).json({
                message: `OTP Is been sent to ${req.body.userEmail} Please Enter to Add it`,
            });
        } else {
            res.status(400).json({ error: "missing Email" });
        }
    }, 2000);
});

module.exports = router;
