const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addEnrollmentTransaction, getEnrollmentTransactionById } = require("../db/enrollment_transactions");
const { readConfig } = require("../libs/config");
const router = libExpress.Router();

const logger = require("../libs/logger");

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["enrollment_id", "amount", "note", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const { payment: { cgst, sgst } = {} } = await readConfig("app");

        const enrollmentTransactionId = await addEnrollmentTransaction({
            ...validatedRequestBody,
            created_by: req.user.id,
            cgst: (validatedRequestBody?.amount * cgst) / (100 + cgst + sgst),
            sgst: (validatedRequestBody?.amount * sgst) / (100 + cgst + sgst),
        });

        res.status(201).json(await getEnrollmentTransactionById({ id: enrollmentTransactionId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
