const libExpress = require("express");
const { addCourse, getCourseById, deleteCourseById, updateCourseViewIndexById, updateCourse, updateCourseById } = require("../db/courses");
const { validateRequestBody } = require("../utils");
const { getEnrollmentByCourseIdAndUserId } = require("../db/enrollments");
const { getCourseSubjects, updateCoursesSubjectsViewIndexById } = require("../db/courses_subjects");
const { updateSubjectViewIndexById } = require("../db/subjects");

const router = libExpress.Router();

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateSubjectViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Subjects" });
});

module.exports = router;
