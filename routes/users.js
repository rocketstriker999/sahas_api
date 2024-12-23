const libExpress = require("express");
const { updateUserPrimaryDetails, getUserByToken } = require("../db/users");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details
router.patch("/:id/primary-details", async (req, res) => {
    if (req.params.id && req.body.name && req.body.phone) {
        if (req.cookies.token) {
            const user = await getUserByToken(req.cookies.token);

            if (user && (await updateUserPrimaryDetails(user.id, req.body.name, req.body.phone))) {
                return res.status(200).json(await getUserByToken(req.cookies.token));
            }
        }
        return res.status(401).json({ error: "Missing Authentication" });
    }
    res.status(400).json({ error: "Invalid/Missing Parameters" });
});

module.exports = router;
