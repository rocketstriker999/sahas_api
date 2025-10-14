const libExpress = require("express");
const { updateCourseSubjectViewIndexById, deleteCourseSubjectById, addCourseSubject } = require("../db/course_subjects");
const logger = require("../libs/logger");

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
router.post("/", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(addCourseSubject);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Course Subjects" });

    // const requiredBodyFields = ["course_id", "subject_id"];

    // const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    // if (isRequestBodyValid) {
    //     const subjectId = await addSubject(validatedRequestBody);
    //     const courseSubjectId = await addCourseSubject({ course_id: validatedRequestBody.course_id, subject_id: subjectId });
    //     res.status(201).json(await getCourseSubjectById({ id: courseSubjectId }));
    // } else {
    //     res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    // }
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing subjectCourseId" });
    }
    deleteCourseSubjectById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
