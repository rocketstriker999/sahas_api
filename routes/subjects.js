const libExpress = require("express");

const { validateRequestBody } = require("../utils");
const { updateSubjectById, addSubject, getAllSubjects } = require("../db/subjects");
const { addCourseSubject, getCourseSubjectById } = require("../db/course_subjects");

const router = libExpress.Router();

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        updateSubjectById(validatedRequestBody);
        res.status(200).json(validatedRequestBody);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/", async (req, res) => {
    //provide all the subjects
    res.status(200).json(await getAllSubjects());
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const subjectId = await addSubject(validatedRequestBody);
        const courseSubjectId = await addCourseSubject({ course_id: validatedRequestBody.course_id, subject_id: subjectId });
        res.status(201).json(await getCourseSubjectById({ id: courseSubjectId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
