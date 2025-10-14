const libExpress = require("express");
const { updateCourseSubjectViewIndexById, deleteCourseSubjectById, addCourseSubject, getCourseSubjectsByCourseId } = require("../db/course_subjects");
const { validateRequestBody } = require("../utils");

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
    const requiredBodyFields = ["subjects", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid && validatedRequestBody?.subjects?.length) {
        await Promise.all(
            validatedRequestBody?.subjects?.map(({ id }) =>
                addCourseSubject({
                    subject_id: id,
                    course_id: validatedRequestBody?.course_id,
                })
            )
        );

        return res.status(201).json(await getCourseSubjectsByCourseId({ course_id: validatedRequestBody?.course_id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
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
