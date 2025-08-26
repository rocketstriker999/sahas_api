const libExpress = require("express");

const { deleteUserRoleByUserRoleId } = require("../db/user_roles");

const router = libExpress.Router();

router.delete("/:userRoleId", async (req, res) => {
    if (!req.params.userRoleId) {
        return res.status(400).json({ error: "Missing Role Id" });
    }

    deleteUserRoleByUserRoleId(req.params.userRoleId);
    res.sendStatus(204);
});

module.exports = router;
