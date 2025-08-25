const libExpress = require("express");
const { deleteRoleAuthorityByRoleAuthorityId } = require("../db/role_authorities");

const router = libExpress.Router();

router.delete("/:roleAuthorityId", async (req, res) => {
    if (!req.params.roleAuthorityId) {
        return res.status(400).json({ error: "Missing roleAuthorityId" });
    }

    deleteRoleAuthorityByRoleAuthorityId(req.params.roleAuthorityId);
    res.sendStatus(204);
});

module.exports = router;
