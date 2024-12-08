const libExpress = require("express");
const { requestService } = require("../utils");
const { userLogin } = require("../db/users");
const libValidator = require("validator");

const router = libExpress.Router();

router.post("/verify", (req, res) => {
    if (req.body.userEmail && libValidator.isEmail(req.body.userEmail) && libValidator.matches(otp, /^[0-9]{4}$/) && req.body.otp) {
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
    if (req.body.userEmail && libValidator.isEmail(req.body.userEmail)) {
        const otp = Math.floor(1000 + Math.random() * 9000);

        requestService({
            requestPath: "/mailer/otp",
            requestMethod: "POST",
            requestPostBody: { to: req.body.userEmail, body_paramters: { verification_code: otp, validity_duration: 5 } },
            onRequestStart: () => {
                userLogin(req.body.userEmail, otp);
            },
            onResponseReceieved: (otpDetails, responseCode) => {
                if (otpDetails && responseCode === 200) {
                    res.status(200).json({
                        message: `OTP Is been sent to ${req.body.userEmail} Please Enter to Add it`,
                    });
                } else {
                    res.status(500).json({ error: "Something Seems to be Broken , Please Try Again Later" });
                }
            },
        });
    } else {
        res.status(400).json({ error: "Missing Email" });
    }
});

module.exports = router;
