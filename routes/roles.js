const libExpress = require("express");
const { logger } = require("sahas_utils");
const { addRole, getRoleById, deleteRoleById, updateRoleById } = require("../db/roles");
const { deleteUserRolesByRoleId } = require("../db/user_roles");
const { getRoleAuthoritiesByRoleId, addRoleAuthority, getRoleAuthorityByRoleAuthorityId, deleteRoleAuthoritiesByRoleId } = require("../db/role_authorities");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    //delete role
    deleteRoleById({ id: req.params.id });
    //this authority needs to go away from user-role
    deleteUserRolesByRoleId({ role_id: req.params.id });
    //need to delete role-authorities as well
    deleteRoleAuthoritiesByRoleId({ role_id: req.params.id });
    res.sendStatus(204);
});

//tested
router.get("/:id/authorities", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    res.status(200).json(await getRoleAuthoritiesByRoleId({ role_id: req.params.id }));
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateRoleById({ ...validatedRequestBody });
        res.status(200).json(await getRoleById({ ...validatedRequestBody }));
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
