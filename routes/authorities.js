const libExpress = require("express");
const { deleteAuthorityByAuthorityId, addAuthority, getAuthorityById } = require("../db/authorities");
const { deleteRoleAuthorityByAuthorityId } = require("../db/role_authorities");
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
    deleteRoleAuthorityByAuthorityId(req.params.authorityId);
    res.sendStatus(204);
});

router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "description"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const authorityId = await addAuthority(validatedRequestBody);
        res.status(201).json(await getAuthorityById({ id: authorityId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
