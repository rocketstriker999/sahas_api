const libExpress = require("express");

const { validateRequestBody } = require("../utils");
const { updateSubjectById } = require("../db/subjects");

const router = libExpress.Router();

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title", "background_color"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        updateSubjectById(validatedRequestBody);
        res.status(200).json(validatedRequestBody);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
