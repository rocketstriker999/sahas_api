const libExpress = require("express");
const { getAccessesByToken } = require("../db/accesses");
const cacher = require("../libs/cacher");
const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const { updateEnrollmentByEnrollmentId, getEnrollmentByEnrollmentId } = require("../db/enrollments");
const router = libExpress.Router();

//get catelogue for user
router.put("/:enrollmentId", async (req, res) => {
    if (!req.params.enrollmentId) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }

    const requiredBodyFields = ["active", "start_date", "end_date"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateEnrollmentByEnrollmentId({ ...validatedRequestBody, id: req.params.enrollmentId });
        res.status(200).json(await getEnrollmentByEnrollmentId(req.params.enrollmentId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
