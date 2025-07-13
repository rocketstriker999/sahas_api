const libExpress = require("express");
const { requestService } = require("../utils");
const { validateUserOTP, updateUserToken, getUserByEmail, getGroupsById, getAuthoritiesById, addUserByEmail } = require("../db/users");
const libValidator = require("validator");
const { generateToken } = require("../utils");
const { addInactiveToken } = require("../db/authentication_tokens");
const { readConfig } = require("../libs/config");

const router = libExpress.Router();

// router.patch("/verify", async (req, res) => {
//     if (req.body.email && req.body.otp && libValidator.isEmail(req.body.email) && libValidator.matches(req.body.otp, /^[0-9]{4}$/)) {
//         //validate otp
//         if (await validateUserOTP(req.body.email, req.body.otp)) {
//             await updateUserToken(req.body.email, generateToken());
//             const user = await getUserByEmail(req.body.email);
//             if (user) {
//                 res.cookie("token", user.token, {
//                     httpOnly: true,
//                     maxAge: process.env.TOKEN_AGE,
//                     secure: true, // Set to true if using HTTPS
//                     sameSite: "None", // Required for cross-origin requests
//                     domain: process.env.CURRENT_DOMAIN,
//                 });
//                 res.status(200).json({
//                     user: {
//                         ...user,
//                         groups: await getGroupsById(user.id),
//                         authorities: await getAuthoritiesById(user.id),
//                     },
//                 });
//             } else {
//                 res.status(401).json({ error: "Email Does not exist" });
//             }
//         } else {
//             res.status(401).json({
//                 error: `Incorrect OTP`,
//             });
//         }
//     } else {
//         res.status(401).json({
//             error: `Missing Requied Paramters or Incorrect Information is submitted`,
//         });
//     }
// });

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
    await addInactiveToken(user.id, otp, authentication_token, new Date(Date.now() + token_validity * 24 * 60 * 60 * 1000));

    //send otp through the mailed
    requestService({
        requestServiceName: process.env.SERVICE_MAILER,
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
