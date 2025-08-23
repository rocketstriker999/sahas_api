const libExpress = require("express");
const { deleteAuthorityByAuthorityId } = require("../db/authorities");
const { deleteRoleAuthorityByRoleAuthorityId } = require("../db/role_authorities");

const router = libExpress.Router();

//Specific Config
router.delete("/:authorityId", async (req, res) => {
    if (!req.params.authorityId) {
        return res.status(400).json({ error: "Missing authorityId" });
    }
    //delete authority
    deleteAuthorityByAuthorityId(req.params.authorityId);
    //this authority needs to go away from roleauthorities
    deleteRoleAuthorityByRoleAuthorityId(req.params.authorityId);
    res.sendStatus(204);
});

module.exports = router;
