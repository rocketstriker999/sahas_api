const libExpress = require("express");
const logger = require("../libs/logger");
const { deleteRoleByRoleId, addRole, getRoleById } = require("../db/roles");
const { deleteUserRoleByRoleId } = require("../db/user_roles");
const {
    getRoleAuthoritiesByRoleId,
    addRoleAuthority,
    getRoleAuthorityByRoleAuthorityId,
    deleteRoleAuthorityByAuthorityId,
    deleteRoleAuthorityByRoleId,
} = require("../db/role_authorities");
const { validateRequestBody } = require("../utils");

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
    //need to delete authorities as well
    deleteRoleAuthorityByRoleId(req.params.roleId);
    res.sendStatus(204);
});

router.get("/:roleId/authorities", async (req, res) => {
    if (!req.params.roleId) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    res.status(200).json(await getRoleAuthoritiesByRoleId(req.params.roleId));
});

router.post("/:roleId/authorities", async (req, res) => {
    if (!req.params.roleId) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    const requiredBodyFields = ["authority_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const roleAuthorityId = await addRoleAuthority({ role_id: req.params.roleId, created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getRoleAuthorityByRoleAuthorityId(roleAuthorityId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.post("/", async (req, res) => {
    const requiredBodyFields = ["title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const roleId = await addRole(validatedRequestBody);
        res.status(201).json(await getRoleById({ id: roleId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
