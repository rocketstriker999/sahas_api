const libExpress = require("express");
const { updateEnrollmentByEnrollmentId, getEnrollmentByEnrollmentId } = require("../db/enrollments");
const { validateRequestBody } = require("../utils");
const { deleteEnrollmentCourseByEnrollmentIdAndCourseId, addEnrollmentCourse, getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId, addTransaction } = require("../db/transactions");
const { readConfig } = require("../libs/config");
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

router.post("/:enrollmentId/courses", async (req, res) => {
    if (!req.params.enrollmentId) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }

    const requiredBodyFields = ["course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await addEnrollmentCourse({ created_by: req.user.id, enrollment_id: req.params.enrollmentId, ...validatedRequestBody });
        res.status(201).json(await getEnrollmentCoursesByEnrollmentId(req.params.enrollmentId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.post("/:enrollmentId/transactions", async (req, res) => {
    if (!req.params.enrollmentId) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }

    const { payment: { cgst, sgst } = {} } = await readConfig("app");

    const requiredBodyFields = ["amount", "note", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await addTransaction({
            created_by: req.user.id,
            enrollment_id: req.params.enrollmentId,
            ...validatedRequestBody,
            cgst: (validatedRequestBody?.amount * cgst) / 100,
            sgst: (validatedRequestBody?.amount * sgst) / 100,
        });
        res.status(201).json(await getTransactionsByEnrollmentId(req.params.enrollmentId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
