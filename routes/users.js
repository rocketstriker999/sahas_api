const libExpress = require("express");
const { updateUserPrimaryDetails, getUserByToken } = require("../db/users");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details -1
router.patch("/:id/primary-details", async (req, res) => {
    if (req.params.id && req.body.name && req.body.phone && req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);

        if (user && (await updateUserPrimaryDetails(user.id, req.body.name, req.body.phone))) {
            return res.status(200).json(await getUserByToken(req.cookies.token));
        }
    }
    return res.status(401).json({ error: "Missing Required Information" });
});

module.exports = router;
