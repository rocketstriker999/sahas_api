const libExpress = require("express");
const { updateEnrollmentById, getEnrollmentById, addEnrollment } = require("../db/enrollments");
const { validateRequestBody } = require("../utils");
const { addEnrollmentCourse, getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId } = require("../db/enrollment_transactions");
const router = libExpress.Router();

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "start_date", "end_date"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateEnrollmentById({ ...validatedRequestBody });
        res.status(200).json(await getEnrollmentById({ ...validatedRequestBody }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["courses", "handler", "end_date", "start_date", "user_id", "amount"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const enrollmentId = await addEnrollment({ created_by: req.user.id, ...validatedRequestBody });
        validatedRequestBody?.courses?.forEach((course) =>
            addEnrollmentCourse({ created_by: req.user.id, enrollment_id: enrollmentId, course_id: course?.id })
        );

        res.status(201).json(await getEnrollmentById({ id: enrollmentId }));
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
