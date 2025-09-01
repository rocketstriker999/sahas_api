const libExpress = require("express");
const logger = require("../libs/logger");
const { addRole, getRoleById, deleteRoleById } = require("../db/roles");
const { deleteUserRoleByRoleId } = require("../db/user_roles");
const {
    getRoleAuthoritiesByRoleId,
    addRoleAuthority,
    getRoleAuthorityByRoleAuthorityId,

    deleteRoleAuthoritiesByRoleId,
} = require("../db/role_authorities");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

//Specific Config
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    //delete authority
    deleteRoleById({ id: req.params.id });
    //this authority needs to go away from roleauthorities
    deleteUserRoleByRoleId({ role_id: req.params.id });
    //need to delete authorities as well
    deleteRoleAuthoritiesByRoleId(req.params.roleId);
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

//tested
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
