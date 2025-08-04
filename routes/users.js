const libExpress = require("express");
const logger = require("../libs/logger");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details -1
// router.patch("/:id/primary-details", async (req, res) => {
//     if (req.params.id && req.body.name && req.body.phone && req.cookies.token) {
//         const user = await getUserByToken(req.cookies.token);

//         if (user && (await updateUserPrimaryDetails(user.id, req.body.name, req.body.phone))) {
//             return res.status(200).json(await getUserByToken(req.cookies.token));
//         }
//     }
//     return res.status(401).json({ error: "Missing Required Information" });
// });

// router.patch("/profile/:id/update-details", async (req, res) => {
//     if (req.params.id && req.body && req.cookies.token) {
//         const user = await getUserByToken(req.cookies.token);
//         if (user && (await updateUserProfilePrimaryDetails(user.id, req.body))) {
//             return res.status(200).json(await getUserByToken(req.cookies.token));
//         }
//     }
//     return res.status(401).json({ error: "Missing Required Information" });
// });

router.get("/", async (req, res) => {
    //all users

    if (req.query) {
        logger.info(JSON.stringify(req.query));
    }

    //if filters and query

    res.status(200).json([{ name: "daw" }]);
});

module.exports = router;
