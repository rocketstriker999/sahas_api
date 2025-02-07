const libExpress = require("express");
const { requestService } = require("../utils");
const { updateUserOTP, validateUserOTP, updateUserToken, getUserByEmail, getGroupsById, getAuthoritiesById } = require("../db/users");
const libValidator = require("validator");
const { generateToken } = require("../utils");

const router = libExpress.Router();

router.post("/verify", async (req, res) => {
    if (req.body.email && req.body.otp && libValidator.isEmail(req.body.email) && libValidator.matches(req.body.otp, /^[0-9]{4}$/)) {
        //validate otp
        if (await validateUserOTP(req.body.email, req.body.otp)) {
            await updateUserToken(req.body.email, generateToken());
            const user = await getUserByEmail(req.body.email);
            if (user) {
                res.cookie("token", user.token, { httpOnly: true, maxAge: process.env.TOKEN_AGE });
                res.status(200).json({
                    user: {
                        ...user,
                        groups: await getGroupsById(user.id),
                        authorities: await getAuthoritiesById(user.id),
                    },
                });
            } else {
                res.status(401).json({ error: "Email Does not exist" });
            }
        } else {
            res.status(401).json({
                error: `Incorrect OTP`,
            });
        }
    } else {
        res.status(401).json({
            error: `Missing Requied Paramters or Incorrect Information is submitted`,
        });
    }
});

router.post("/create", async (req, res) => {
    if (req.body.email && libValidator.isEmail(req.body.email)) {
        const otp = Math.floor(1000 + Math.random() * 9000);

        requestService({
            requestPath: "otp",
            requestMethod: "POST",
            requestPostBody: { to: req.body.email, body_paramters: { verification_code: otp, validity_duration: 5 } },
            onRequestStart: () => {
                updateUserOTP(req.body.email, otp);
            },
            onRequestFailure: (error) => console.log(error),
            onResponseReceieved: (otpDetails, responseCode) => {
                if (otpDetails && responseCode === 200) {
                    res.status(200).json({
                        message: `OTP Is been sent to ${req.body.email} Please Enter to Add it`,
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
