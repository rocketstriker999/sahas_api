const libExpress = require("express");
const { deleteEnrollmentCourseByEnrollmentCourseId, addEnrollmentCourse, getEnrollmentCourseById } = require("../db/enrollment_courses");
const { validateRequestBody } = require("../utils");
const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["enrollment_id", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const enrollmentCourseId = await addEnrollmentCourse({ created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getEnrollmentCourseById({ id: enrollmentCourseId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.delete("/:id", async (req, res) => {
    if (!req.params.enrollmentCourseId) {
        return res.status(400).json({ error: "Missing enrollmentCourseId" });
    }
    deleteEnrollmentCourseByEnrollmentCourseId(req.params.enrollmentCourseId);
    res.sendStatus(204);
});

module.exports = router;
