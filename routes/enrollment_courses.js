const libExpress = require("express");
const { deleteEnrollmentCourseByEnrollmentCourseId } = require("../db/enrollment_courses");
const router = libExpress.Router();

router.delete("/:enrollmentCourseId", async (req, res) => {
    if (!req.params.enrollmentCourseId) {
        return res.status(400).json({ error: "Missing enrollmentCourseId" });
    }
    deleteEnrollmentCourseByEnrollmentCourseId(req.params.enrollmentCourseId);
    res.sendStatus(204);
});

module.exports = router;
