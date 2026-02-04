const libExpress = require("express");
const { deleteAuthorityById, addAuthority, getAuthorityById } = require("../db/authorities");
const { deleteRoleAuthoritiesByAuthorityId } = require("../db/role_authorities");
const { validateRequestBody } = require("sahas_utils");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");

const router = libExpress.Router();

//tested
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_AUTHORITIES), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing authorityId" });
    }
    //delete authority
    deleteAuthorityById({ id: req.params.id });
    //this authority needs to go away from roleauthorities
    deleteRoleAuthoritiesByAuthorityId({ authority_id: req.params.id });
    res.sendStatus(204);
});

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_AUTHORITIES), async (req, res) => {
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
