const libExpress = require("express");
const { deleteRoleAuthorityById } = require("../db/role_authorities");

const router = libExpress.Router();

router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing roleAuthorityId" });
    }

    deleteRoleAuthorityById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
