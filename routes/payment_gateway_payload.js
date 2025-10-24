const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["category_id", "title", "description", "image", "fees", "whatsapp_group"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const payload = {
            course: await getCourseById({ id: req.params.id }),
        };

        res.status(201).json(payload);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }

    //if already existing enrollment is there then do not give back the payment hash
});

module.exports = router;
