const libExpress = require("express");
const { requestService } = require("../utils");
const { getUserByEmail, addUserByEmail, getUserById } = require("../db/users");
const libValidator = require("validator");
const { generateToken } = require("../utils");
const { addInactiveToken, getTokenByOTP, activateTokenByOTP, activateToken } = require("../db/authentication_tokens");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");

const router = libExpress.Router();

//work on blocked user #2
//once receieved the info on UI save into reudx
//check what fields need to be sent
//logout with invalidate call from front end
//if user already has the token then validate from ui side

router.patch("/", async (req, res) => {
    if (!req.body.otp || !req.body.authentication_token) {
        return res.status(400).json({ error: "Missing Required Parameters - OTP or Token" });
    }

    if ((authenticationToken = await getTokenByOTP(req.body.authentication_token, req.body.otp))) {
        activateToken(req.body.authentication_token);
        return res.status(200).json({ ...(await getUserById(authenticationToken.user_id)), roles: [] });
    }
    return res.status(400).json({ error: "Invalid Token" });
});

router.post("/", async (req, res) => {
    const { authentication: { token_validity, otp_validity } = {} } = await readConfig("app");

    if (!token_validity || !otp_validity) {
        return res.status(500).json({ error: "Missing Configuration token_validity or otp_validity" });
    }

    if (!req.body.email || !libValidator.isEmail(req.body.email)) {
        return res.status(400).json({ error: "Missing or Invalid Email" });
    }

    //Get The user
    await addUserByEmail(req.body.email);

    const user = await getUserByEmail(req.body.email);

    //generate an otp and token
    const otp = Math.floor(1000 + Math.random() * 9000);
    const authentication_token = generateToken();
    //add token into table
    logger.info("Generated Inactive Token");
    await addInactiveToken(user.id, otp, authentication_token, new Date(Date.now() + token_validity * 24 * 60 * 60 * 1000));

    //send otp through the mailed
    requestService({
        requestServiceName: process.env.SERVICE_MAILER,
        onRequestStart: () => logger.info("Generating OTP"),
        requestPath: "otp",
        requestMethod: "POST",
        requestPostBody: {
            to: req.body.email,
            body_paramters: { verification_code: otp, validity_duration: otp_validity, requested_email: user.email },
        },
        onResponseReceieved: (otpDetails, responseCode) => {
            if (otpDetails && responseCode === 200) {
                res.status(201).json({ authentication_token });
            } else {
                res.status(500).json({ error: "Something Seems to be Broken , Please Try Again Later" });
            }
        },
    });
});

router.get("/", async (req, res) => {
    if (req?.user) {
        return res.status(200).json(req.user);
    }
    return res.status(401).json({ error: "Invalid Token" });
});

// //logout and invalidate the authentication token
// router.delete("/verify", (req, res) => {
//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: true, // Set to true if using HTTPS
//         sameSite: "None", // Required for cross-origin requests
//         domain: process.env.CURRENT_DOMAIN,
//     });
//     return res.status(200).json({
//         message: "Token Invalidated",
//     });
//     res.status(200);
// });

// //verify the details of user
// router.get("/verify", async (req, res) => {
//     //if token is present
//     if (req.cookies.token) {
//         const user = await getUserByToken(req.cookies.token);
//         if (user) {
//             res.status(200).json({
//                 user: { ...user, groups: await getGroupsById(user.id), authorities: await getAuthoritiesById(user.id) },
//             });
//         } else {
//             res.status(401).json({ error: "Invalid Token" });
//         }
//     } else {
//         res.status(401).json({ error: "Invalid Token" });
//     }
// });

module.exports = router;
