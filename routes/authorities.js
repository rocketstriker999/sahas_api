const libExpress = require("express");
const { deleteAuthorityByAuthorityId, addAuthority, getAuthorityByAuthorityId } = require("../db/authorities");
const { deleteRoleAuthorityByRoleAuthorityId } = require("../db/role_authorities");
const { validateRequestBody } = require("../utils");

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

router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "authority"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const authorityId = await addAuthority(validatedRequestBody?.authority);
        res.status(201).json(await getAuthorityByAuthorityId(authorityId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
