const libExpress = require("express");
const { getAllPolicies, updatePolicyById, deletePolicyById, getPolicyById, addPolicy, updatePolicyViewIndexById } = require("../db/policies");
const { validateRequestBody } = require("sahas_utils");
const { AUTHORITIES } = require("../constants");

const router = libExpress.Router();

// Get All Policies
router.get("/", async (req, res) => {
    const policies = await getAllPolicies();
    res.status(200).json(policies);
});

// Post the Policy
router.post("/", requires_authority(AUTHORITIES.CREATE_POLICY), async (req, res) => {
    const requiredBodyFields = ["id", "title", "description"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await addPolicy(validatedRequestBody);
        res.status(201).json(await getPolicyById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

// Patch the Policy
router.patch("/", requires_authority(AUTHORITIES.UPDATE_POLICY), async (req, res) => {
    const requiredBodyFields = ["id", "title", "description"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updatePolicyById(validatedRequestBody);
        res.status(200).json(await getPolicyById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

// Delete the Policy
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_POLICY), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Policy Id" });
    }
    await deletePolicyById({ id: req.params.id });
    res.sendStatus(204);
});

//tested
router.patch("/view_indexes", requires_authority(AUTHORITIES.UPDATE_POLICY_VIEW_INDEX), async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updatePolicyViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Courses" });
});

module.exports = router;
