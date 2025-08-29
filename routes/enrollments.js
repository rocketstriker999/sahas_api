const libExpress = require("express");
const { updateEnrollmentById, getEnrollmentById, addEnrollment } = require("../db/enrollments");
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

router.post("/", async (req, res) => {
    const requiredBodyFields = ["course_id", "end_date", "start_date", "user_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const enrollmentId = await addEnrollment({ created_by: req.user.id, ...validatedRequestBody });
        res.status(200).json(await getEnrollmentById({ id: enrollmentId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/:id/transactions", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }
    res.status(200).json(await getTransactionsByEnrollmentId({ enrollment_id: req.params.id }));
});

//tested
router.get("/:id/courses", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Enrollment Id" });
    }
    res.status(200).json(await getEnrollmentCoursesByEnrollmentId({ enrollment_id: req.params.id }));
});

module.exports = router;
