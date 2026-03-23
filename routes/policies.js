const libExpress = require("express");
const { getAllPolicies, updatePolicyById, deletePolicyById, getPolicyById } = require("../db/policies");
const { validateRequestBody } = require("sahas_utils");

const router = libExpress.Router();

// Get All Policies
router.get("/", async (req, res) => {
    const policies = await getAllPolicies();
    res.status(200).json(policies);
});

// Patch the Policy
router.patch("/", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Policy Id" });
    }
    await deletePolicyById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
