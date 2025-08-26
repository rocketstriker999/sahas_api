const libExpress = require("express");
const { updateEnrollmentById, getEnrollmentById } = require("../db/enrollments");
const { validateRequestBody } = require("../utils");
const { addEnrollmentCourse, getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId, addTransaction } = require("../db/enrollment_transactions");
const { readConfig } = require("../libs/config");
const router = libExpress.Router();

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "active", "start_date", "end_date"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateEnrollmentById({ ...validatedRequestBody });
        res.status(200).json(await getEnrollmentById({ ...validatedRequestBody }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:id/transactions", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }

    res.status(200).json(await getTransactionsByEnrollmentId({ enrollment_id: req.params.id }));
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

    const requiredBodyFields = ["amount", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await addTransaction({
            created_by: req.user.id,
            enrollment_id: req.params.enrollmentId,
            ...validatedRequestBody,
            cgst: (validatedRequestBody?.amount * cgst) / (100 + cgst + sgst),
            sgst: (validatedRequestBody?.amount * sgst) / (100 + cgst + sgst),
            note: req.body.note,
        });
        res.status(201).json(await getTransactionsByEnrollmentId(req.params.enrollmentId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
