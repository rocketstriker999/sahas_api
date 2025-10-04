const libExpress = require("express");
const { updateCourseSubjectViewIndexById } = require("../db/course_subjects");

const router = libExpress.Router();

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateCourseSubjectViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Subjects" });
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Subject Id" });
    }
    deleteCourseById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
