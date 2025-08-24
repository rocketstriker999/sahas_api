const libExpress = require("express");
const logger = require("../libs/logger");
const { deleteRoleByRoleId } = require("../db/roles");
const { deleteUserRoleByUserRoleId, deleteUserRoleByRoleId } = require("../db/user_roles");
const { getRoleAuthoritiesByRoleId } = require("../db/role_authorities");

const router = libExpress.Router();

//Specific Config
router.delete("/:roleId", async (req, res) => {
    if (!req.params.roleId) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    //delete authority
    deleteRoleByRoleId(req.params.roleId);
    //this authority needs to go away from roleauthorities
    deleteUserRoleByRoleId(req.params.roleId);
    res.sendStatus(204);
});

router.get("/:roleId/authorities", async (req, res) => {
    if (!req.params.roleId) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    res.status(200).json(await getRoleAuthoritiesByRoleId(req.params.roleId));
});

module.exports = router;
