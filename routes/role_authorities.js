const libExpress = require("express");
const { deleteRoleAuthorityById, addRoleAuthority, getRoleAuthorityByRoleAuthorityId, getRoleAuthorityById } = require("../db/role_authorities");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

router.post("/authorities", async (req, res) => {
    if (!req.params.roleId) {
        return res.status(400).json({ error: "Missing roleId" });
    }
    const requiredBodyFields = ["role_id", "authority_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const roleAuthorityId = await addRoleAuthority({ created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getRoleAuthorityById({ id: roleAuthorityId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing roleAuthorityId" });
    }

    deleteRoleAuthorityById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
