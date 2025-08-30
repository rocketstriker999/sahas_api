const libExpress = require("express");

const { deleteUserRoleById } = require("../db/user_roles");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["user_id", "role_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const userRoleId = await addUserRoleByUserIdAndRoleId({ user_id: req.params.userId, created_by: req.user.id, ...validatedRequestBody });

        res.status(201).json(await getUserRoleByUserRoleId(userRoleId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.delete("/:userRoleId", async (req, res) => {
    if (!req.params.userRoleId) {
        return res.status(400).json({ error: "Missing User Role Id" });
    }

    deleteUserRoleById({ id: req.params.userRoleId });
    res.sendStatus(204);
});

module.exports = router;
