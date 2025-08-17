const libExpress = require("express");
const { updateEnrollmentByEnrollmentId, getEnrollmentByEnrollmentId } = require("../db/enrollments");
const { validateRequestBody } = require("../utils");
const { deleteEnrollmentCourseByEnrollmentIdAndCourseId, addEnrollmentCourse, getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
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

router.delete("/:enrollmentId/courses/:courseId", async (req, res) => {
    if (!req.params.enrollmentId || !req.params.courseId) {
        return res.status(400).json({ error: "Missing Enrollment Id or courseId" });
    }
    deleteEnrollmentCourseByEnrollmentIdAndCourseId({ enrollment_id: req.params.enrollmentId, course_id: req.params.courseId });
    res.sendStatus(204);
});

module.exports = router;
